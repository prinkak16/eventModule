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
    chunk_size = 50000
    CSV.parse(file.read, headers: true).each_slice(chunk_size) do |chunk|

    end
  end

end