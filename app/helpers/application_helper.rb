module ApplicationHelper

  include SendGrid

  def send_email(subject, content, recipients, attachments = [])
    require 'sendgrid-ruby'

    from = Email.new(email: 'noreply@jarvis.consulting')
    html_content = Content.new(type: 'text/html',
                               value: content)
    sg = SendGrid::API.new(api_key: ENV['SENDGRID_API_KEY'])

    personalization = Personalization.new

    recipients.each do |recipient|
      personalization.add_to(Email.new(email: recipient))
    end

    mail = SendGrid::Mail.new
    mail.from = from
    mail.subject = subject
    mail.add_content(html_content)
    mail.add_personalization(personalization)

    if Rails.env.production?
      sg.client.mail._('send').post(request_body: mail.to_json)
    else
      sg.client.mail._('send').post(request_body: mail.to_json)
      puts mail.to_json
    end
  end

  def current_user
    User.find_by_id(session[:user_id])
  end

  def has_event_create_permission
    client_app_id = ClientApp.find_by(name: ENV['CLIENT_APP'])&.id
    app_permission_id = AppPermission.find_by(name: ENV['CLIENT_APP_PERMISSION'], action: "Create")&.id
    if client_app_id.present? && app_permission_id.present?
      UserPermission.find_by(user_id: session[:user_id], app_permission_id: app_permission_id, client_app_id: client_app_id).present?
    else
      false
    end
  end

  def country_states_with_create_permission
    client_app_id = ClientApp.find_by(name: ENV['CLIENT_APP'])&.id
    locations = UserTagLocation.joins("INNER JOIN user_permissions on user_tag_locations.user_tag_id = user_permissions.user_tag_id").where(user_permissions: { user_id: session[:user_id] ,client_app_id: client_app_id}, location_type: "Saral::Locatable::State").pluck(:location_id).uniq
    Saral::Locatable::State.where(id: locations).select(:id, :name).order(:name)
  end

  def check_if_already_in_progress(queue:, args: [])
    already_in_progress = false
    enqueued_jobs = Resque.peek(queue, 0, Resque.size(queue) + 2) # adding 2 to avoid nil or {}
    enqueued_jobs.each do |job|
      # job {"class"=>"CreateCalleesJobUrgent", "args"=>[793]}
      already_in_progress = (job['args'] == args)
      break if already_in_progress
    end

    if !already_in_progress
      # check if in progress
      workers = Resque.workers
      workers.each do |worker|
        job = worker.job
        # worker {"queue"=>"create_callees_urgent", "run_at"=>"2024-02-13T18:41:57Z", "payload"=>{"class"=>"CreateCalleesJobUrgent", "args"=>[793]}}
        if job['queue'] == queue
          already_in_progress = (job['payload']['args'] == args)
          break if already_in_progress
        end
      end
    end
    already_in_progress
  end

end
