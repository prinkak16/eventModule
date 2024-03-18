module UserUploadCsvJob

  def self.perform(event_id = nil)
    event = Event.find_by(id: event_id)
    begin
      puts "trying with UTF-8"
      file = URI.open(event.csv_file.url)
      file.set_encoding(Encoding.find("UTF-8"))
    rescue => _
      puts "trying with ISO"
      file = URI.open(event.csv_file.url)
      file.set_encoding(Encoding.find("ISO-8859-1"))
    end
    chunk_size = 5000
    CSV.parse(file.read, headers: true).each_slice(chunk_size) do |chunk|
      insert_array = []
      chunk.each do |row|
        event_user = EventUser.new
        event_user.event_id = event.id
        event_user.phone_number = row['phone_number']
        event_user.event_user_locations.build(country_state_id: row['country_state_id'], )
      end
    end
  end

end


all_callees.find_in_batches(batch_size: 1000) do |batch|
  insert_array = []
  batch.each do |ac|
    new_callee = ac.dup
    new_callee.campaign_id = dup_camp_id
    new_callee.user_id = nil
    new_callee.assigned_at = nil
    new_callee.retry_count = nil
    new_callee.is_disposed = false
    new_callee.back_off_time = nil
    new_callee.call_status_type_id = nil
    new_callee.rejected_at = nil
    new_callee.verified_at = nil
    new_callee.mismatched_at = nil
    new_callee.dial_count = 0
    new_callee.last_user_id = nil
    new_callee.aasm_state = 'unassigned'
    ac.callee_fields.each do |cf|
      new_callee.callee_fields.build(name: cf.name, value: cf.value, is_correct: cf.is_correct, alternate_value: cf.alternate_value)
    end
    insert_array << new_callee
  end

  begin
    Callee.import insert_array, recursive: true, batch_size: 10_00, on_duplicate_key_ignore: true
  rescue ActiveRecord::RecordNotUnique => _
    # ignored
    # No need to report database validation errors due to race conditions.
    puts "Got RecordNotUnique exception"
  end
end