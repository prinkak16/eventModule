class FetchReportsJob
  include Sidekiq::Worker
  require 'csv'
  include ApplicationHelper
  sidekiq_options queue: :report

  def perform(event_id = nil, mail_ids = nil)
    begin
      event = Event.find_by(id: event_id)
      event_form = EventForm.find_by(event_id: event_id)
      mongo_db = Mongo::Client.new('mongodb://admin:Jarvis$1234@10.190.15.227:27017/saral_form_builder?serverSelectionTimeoutMS=5000&connectTimeoutMS=10000&authMechanism=SCRAM-SHA-1&authSource=admin')
      subject = "Event Report Download"
      content = "Event-#{event.name} download has started."
      send_email(subject, content, mail_ids)
      if event.status_aasm_state == 'Expired' && event.report_file.attached?
        subject = "Event Report Download"
        content = "Event-#{event.name} Report can be download through this URL - #{event.report_file.service_url}"
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
                                             eventId: "53",
                                             status: "COMPLETED",
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
                                               else: ["$questions.answer"]
                                             }
                                           },
                                           createdAt: 1,
                                           updatedAt: 1
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
                                           updatedAt: '$_id.updatedAt'
                                         }
                                         }
                                       ]).to_json)
        mongo_db.close
        headers = ['Username', 'user_phonenumber']
        for i in 0...questions.first["question"].size
          if questions.first["question"][i]["title"].first["value"] != "Provide your event location."
            headers << questions.first["question"][i]["title"].first["value"]
          end
        end
        headers << ['createdAt','updatedAt']
        file_name = "#{event_id}"
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
            for j in 0...data[i]["questions"]
              hash[data[i]["questions"][j]["question"]] = data[i]["questions"][j]["answer"]
            end
            for k in 2...headers.size-2
              if hash[headers[k]].present?
                row_data << hash[headers[k]]
              else
                row_data << ""
              end
            end
            row_data << data[i]["createdAt"]
            row_data << data[i]["updatedAt"]
            csv << row_data
          end
        end
        event.report_file.attach(io: csv_file, filename: file_name, content_type: 'text/csv')
        subject = "Event Report Download"
        content = "Event-#{event.name} Report can be download through this URL - #{event.report_file.url}"
        send_email(subject, content, mail_ids)
      end
    rescue => e
      puts "Job stopped executing because of #{e.message}"
    end
  end

end