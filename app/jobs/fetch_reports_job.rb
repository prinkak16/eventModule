module FetchReportsJob
  require 'csv'
  require 'open-uri'
  include ApplicationHelper
  @queue = :report

  def self.perform(event_id = nil, mail_ids = nil, time_limit = nil)
    begin
      if time_limit.split(' ')[0] == "Last"
        check = true
      else
        check = false
      end
      event = Event.find_by(id: event_id)
      event_form = EventForm.find_by(event_id: event_id)
      mongo_db = Mongo::Client.new(ENV["MONGO_URL"])
      subject = "Event Report Download for event #{event.name}"
      content = "Event Report Download processing has been started."
      content += "<br/>This is a automated mail. Do not reply. Jarvis Technology & Strategy Consulting"
      ApplicationController.helpers.send_email(subject, content, mail_ids)
      if event.status_aasm_state == 'Expired' && event.report_file.attached? && event.report_file.created_at >= event.end_date
        file_url = event.report_file.url
        subject = "Event Report Download for event #{event.name}"
        content = "Event Report for #{event.name} has been processed and can be downloaded by clicking on the below url."
        content += "<br/><a href=#{file_url}>Click to Download #{event.name} Report.</a><br/>"
        content += "<br/>This is a automated mail. Do not reply. Jarvis Technology & Strategy Consulting"
        ApplicationController.helpers.send_email(subject, content, mail_ids)
      else
        puts "Question Query Started"
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
        ).allow_disk_use(true).to_json)
        puts "Question Query ended"
        db = mongo_db[:formsubmissions]
        headers = ['Username', 'User Phone Number', 'Submission Id']
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
        file_name = "#{event.name}_#{DateTime.now.to_date}.csv"
        csv_file = Tempfile.new([file_name, ''])
        phone_numbers = Hash.new
        event_submissions = EventSubmission.where(event_id: event.id)
        event_submissions.each do |submission|
          phone_numbers[submission.submission_id] = submission.user.phone_number
        end
        if !check && event.report_file.attached?
          pipeline = conditional_pipeline_query(event)
          data = JSON.parse(db.aggregate(pipeline).allow_disk_use(true).to_json)
          hashed_data = Hash.new
          deleted_data = Hash.new
          puts "The size of array - #{data.size}"
          for i in 0...data.size
            row_data = []
            row_data << data[i]["username"]
            row_data << phone_numbers[data[i]["submissionId"]]
            row_data << data[i]["submissionId"]
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
                hash[data[i]["questions"][j]["question"]] = temp.chop
              else
                hash[data[i]["questions"][j]["question"]] = data[i]["questions"][j]["answer"].join(',')
              end
            end
            k = 3
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
            hashed_data[data[i]["submissionId"]] = row_data
            if data[i]["deletedAt"].present?
              deleted_data[data[i]["submissionId"]] = true
            end
          end
          begin
            puts "trying with UTF-8"
            file = URI.open(event.report_file.url)
            file.set_encoding(Encoding.find("UTF-8"))
          rescue => _
            puts "trying with ISO"
            file = URI.open(event.report_file.url)
            file.set_encoding(Encoding.find("ISO-8859-1"))
          end
          chunk_size = 50000
          CSV.open(csv_file, 'a+') do |csv|
            csv << headers
            CSV.parse(file.read, headers: true).each_slice(chunk_size) do |chunk|
              chunk.each do |row|
                if deleted_data[row['Submission Id']]
                  hashed_data.delete(row['Submission Id'])
                elsif hashed_data[row['Submission Id']].present?
                  csv << hashed_data[row['Submission Id']]
                  hashed_data.delete(row['Submission Id'])
                else
                  csv <<  row
                end
              end
            end
            hashed_data.each_pair do |key, value|
              csv << value
            end
          end
        else
          CSV.open(csv_file, 'w') do |csv|
            csv << headers
            offset = 0
            limit = 50000
            pipeline = pipeline_query(event, offset, limit)
            if check
              time = time_limit.split(' ')
              match_stage = {
                '$match': {
                  'createdAt': {
                    '$gte': Time.now - (time[1].to_i).hours
                  }
                }
              }
              pipeline.unshift(match_stage)
              count = db.find({eventId: "#{event_id}", deletedAt: nil , 'createdAt': { '$gte': Time.now - (time[1].to_i).hours } }).count()
            else
              count = db.find({eventId: "#{event_id}", deletedAt: nil}).count()
            end
            begin
              data = JSON.parse(db.aggregate(pipeline).allow_disk_use(true).to_json)
              puts "Data Query Processed - #{offset}"
              puts "The size of array - #{data.size}"
              for i in 0...data.size
                row_data = []
                row_data << data[i]["username"]
                row_data << phone_numbers[data[i]["submissionId"]]
                row_data << data[i]["submissionId"]
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
                    hash[data[i]["questions"][j]["question"]] = temp.chop
                  else
                    hash[data[i]["questions"][j]["question"]] = data[i]["questions"][j]["answer"].join(',')
                  end
                end
                k = 3
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
              offset = offset + limit
            end while offset < count
          end
        end
        attachment = []
        if check
          attachment << csv_file.path
        else
          event.report_file.attach(io: csv_file, filename: file_name, content_type: 'text/csv')
          file_url = event.report_file.url
        end
        subject = "Event Report Download for event #{event.name}"
        content = "Event Report for #{event.name} has been processed and can be downloaded by clicking on the below url."
        content += "<br/><a href=#{file_url}>Click to Download #{event.name} Report.</a><br/>"
        content += "<br/>This is a automated mail. Do not reply. Jarvis Technology & Strategy Consulting"
        if check
          ApplicationController.helpers.send_email(subject, content, mail_ids, attachment)
        else
          ApplicationController.helpers.send_email(subject, content, mail_ids)
        end
        mongo_db.close
      end
    rescue => e
      puts "Job stopped executing because of #{e.message}"
    end
  end

  def self.conditional_pipeline_query(event  = nil)
    [
      {
        '$match': {
          eventId: "#{event.id}",
          '$or': [
            {
              updatedAt: {
                '$gte': event.report_file.created_at
              }
            },
            {
              deletedAt: {
                '$gte': event.report_file.created_at
              }
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
        deletedAt: 1,
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
          deletedAt: '$deletedAt',
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
        deletedAt: '$_id.deletedAt',
        status: '$_id.status'
      }
      }
    ]
  end

  def self.pipeline_query(event = nil, offset = nil, limit = nil)
    [
      {
        '$match': {
          eventId: "#{event.id}",
          deletedAt: nil
        }
      },
      { "$sort": { "createdAt": -1 } },
      { "$skip": offset },
      { "$limit": limit },
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
    ]
  end

end