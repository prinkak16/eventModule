class FetchReportsJob
  include Sidekiq::Worker
  require 'csv'
  include ApplicationHelper
  sidekiq_options queue: :report

  def perform(event_id = nil, mail_ids = nil)
    begin
      event = Event.find_by(id: event_id)
      event_form = EventForm.find_by(event_id: event_id)
      mongo_db = Mongo::Client.new(ENV["MONGO_URL"])
      subject = "Event Report Download for event #{event.name}"
      content = "Event Report Download processing has been started."
      content += "<br/>This is a automated mail. Do not reply. Jarvis Technology & Strategy Consulting"
      send_email(subject, content, mail_ids)
      if event.status_aasm_state == 'Expired' && event.report_file.attached?
        file_url = event.report_file.url
        subject = "Event Report Download for event #{event.name}"
        content = "Event Report for #{event.name} has been processed and can be downloaded by clicking on the below url."
        content += "<br/><a href=#{file_url}>Click to Download #{event.name} Report.</a><br/>"
        content += "<br/>This is a automated mail. Do not reply. Jarvis Technology & Strategy Consulting"
        send_email(subject, content, mail_ids)
      else
        question_db = mongo_db[:forms]
        questions = JSON.parse(question_db.aggregate(
          [
            {
              '$match': {
                formId: "#{event_form.form_id}"
              }
            }, {
              '$unwind': "$questions"
            },
            {
              '$group': {
                _id: 1,
                question: {
                  '$push': {
                    'title': '$questions.title',
                    'isHidden': '$questions.isHidden'
                  }
                }
              }
            }
          ]
        ).to_json)
        db = mongo_db[:formsubmissions]
        data = JSON.parse(db.aggregate([
                                         {
                                           '$match': {
                                             eventId: "#{event.id}",
                                             '$or': [
                                               {
                                                 deletedAt: {
                                                   '$exists': false
                                                 }
                                               },
                                               {
                                                 deletedAt: nil
                                               }
                                             ]
                                           }
                                         },
                                         {
                                           '$unwind': "$questions"
                                         },
                                         { '$match': {
                                           "questions.isAnswered": true
                                         }
                                         },
                                         { '$project': {
                                           _id: 1,
                                           userName: "$user.name",
                                           eventId: 1,
                                           submissionId: 1,
                                           question: { '$arrayElemAt': ["$questions.title.value", 0] },
                                           answer: {
                                             '$cond': {
                                               if: {
                                                 '$in': [
                                                   "$questions.type",
                                                   ["imageUpload", "audioUpload", "docUpload", "videoUpload"]
                                                 ]
                                               },
                                               then: "$questions.files.value",
                                               else: {
                                                 '$cond': {
                                                   if: {
                                                     '$in': [
                                                       "$questions.type",
                                                       ["radio", "dropdown"]
                                                     ]
                                                   },
                                                   then: "$questions.options",
                                                   else: ["$questions.answer"]
                                                 }
                                               }
                                             }
                                           },
                                           createdAt: 1,
                                           updatedAt: 1,
                                           status: 1
                                         }
                                         },
                                         { '$group': {
                                           _id: {
                                             id: '$_id',
                                             username: '$userName',
                                             eventId: '$eventId',
                                             submissionId: '$submissionId',
                                             createdAt: '$createdAt',
                                             updatedAt: '$updatedAt',
                                             status: '$status',
                                           },
                                           questions: {
                                             '$push': {
                                               question: "$question",
                                               answer: "$answer"
                                             }
                                           }
                                         }
                                         },
                                         { '$project': {
                                           _id: 0,
                                           id: '$_id.id',
                                           username: '$_id.username',
                                           eventId: '$_id.eventId',
                                           submissionId: '$_id.submissionId',
                                           questions: 1,
                                           createdAt: '$_id.createdAt',
                                           updatedAt: '$_id.updatedAt',
                                           status: '$_id.status'
                                         }
                                         }
                                       ]).to_json)
        mongo_db.close
        headers = ['Username', 'User Phone Number']
        for i in 0...questions.first["question"].size
          if questions.first["question"][i]["title"].first["value"] != "Provide your event location."
            if questions.first["question"][i]["isHidden"] == true
              headers << questions.first["question"][i]["title"].first["value"] + "(isHidden)"
            else
              headers << questions.first["question"][i]["title"].first["value"]
            end
          end
        end
        headers << 'createdAt'
        headers << 'updatedAt'
        headers << 'status'
        file_name = "#{event.name}" + "-report"
        csv_file = Tempfile.new([file_name, '.csv'])
        file_name += '.csv'
        CSV.open(csv_file, 'w') do |csv|
          csv << headers
          for i in 0...data.size
            row_data = []
            phone_number = EventSubmission.find_by(event_id: event.id, submission_id: data[i]['submissionId'])&.user&.phone_number
            row_data << data[i]['username']
            row_data << phone_number
            hash = Hash.new
            for j in 0...data[i]["questions"].size
              if data[i]["questions"][j]["answer"].first.class == Hash
                temp = ""
                for m in 0...data[i]["questions"][j]["answer"].size
                  if data[i]["questions"][j]["answer"][m]["isAnswered"] == true
                    for n in 0..data[i]["questions"][j]["answer"][m]["label"].size
                      if data[i]["questions"][j]["answer"][m]["label"][n]["lang"] == "en"
                        temp += data[i]["questions"][j]["answer"][m]["label"][n]["value"] + ":"
                        break
                      end
                    end
                  end
                end
                hash[data[i]["questions"][j]["question"]] = temp.chomp
              else
                hash[data[i]["questions"][j]["question"]] = data[i]["questions"][j]["answer"].join(',')
              end
            end
            k = 2
            while k < (headers.size - 3)
              if hash[headers[k]].present?
                row_data << hash[headers[k]]
              else
                row_data << ""
              end
              k += 1
            end
            row_data << DateTime.parse(data[i]["createdAt"]).in_ist.strftime("%B %e, %Y %H:%M:%S")
            row_data << DateTime.parse(data[i]["updatedAt"]).in_ist.strftime("%B %e, %Y %H:%M:%S")
            row_data <<  data[i]["status"]
            csv << row_data
          end
        end
        event.report_file.attach(io: csv_file, filename: file_name, content_type: 'text/csv')
        file_url = event.report_file.url
        subject = "Event Report Download for event #{event.name}"
        content = "Event Report for #{event.name} has been processed and can be downloaded by clicking on the below url."
        content += "<br/><a href=#{file_url}>Click to Download #{event.name} Report.</a><br/>"
        content += "<br/>This is a automated mail. Do not reply. Jarvis Technology & Strategy Consulting"
        send_email(subject, content, mail_ids)
      end
    rescue => e
      puts "Job stopped executing because of #{e.message}"
    end
  end

end