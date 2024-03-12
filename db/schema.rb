# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_03_12_111846) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "event_forms", force: :cascade do |t|
    t.integer "event_id"
    t.string "form_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_event_forms_on_deleted_at"
  end

  create_table "event_locations", force: :cascade do |t|
    t.bigint "event_id", null: false
    t.string "location_type"
    t.bigint "location_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "state_id"
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_event_locations_on_deleted_at"
    t.index ["event_id"], name: "index_event_locations_on_event_id"
    t.index ["location_type", "location_id"], name: "index_event_locations_on_location"
  end

  create_table "event_submissions", force: :cascade do |t|
    t.string "form_id"
    t.string "submission_id"
    t.bigint "event_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "user_id"
    t.datetime "deleted_at"
    t.index ["created_at"], name: "index_event_submissions_on_created_at", order: :desc
    t.index ["deleted_at"], name: "index_event_submissions_on_deleted_at"
    t.index ["event_id", "user_id", "submission_id", "form_id"], name: "index_event_submissions_on_event_user_submission_form"
    t.index ["event_id"], name: "index_event_submissions_on_event_id"
  end

  create_table "events", force: :cascade do |t|
    t.string "name"
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status_aasm_state", default: "upcoming"
    t.string "event_type"
    t.integer "state_id"
    t.datetime "start_date"
    t.datetime "end_date"
    t.datetime "deleted_at"
    t.boolean "published", default: false
    t.integer "parent_id"
    t.boolean "has_sub_event", default: false
    t.jsonb "translated_title"
    t.integer "position"
    t.boolean "pinned", default: false
    t.integer "created_by_id"
    t.integer "data_level_id"
    t.index ["deleted_at"], name: "index_events_on_deleted_at"
    t.index ["translated_title"], name: "index_events_on_translated_title", using: :gin
  end

  create_table "user_event_locations", force: :cascade do |t|
    t.string "location_type"
    t.bigint "location_id"
    t.bigint "user_event_id"
    t.integer "country_state_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["location_type", "location_id"], name: "index_user_event_locations_on_location"
    t.index ["user_event_id"], name: "index_user_event_locations_on_user_event_id"
  end

  create_table "user_events", force: :cascade do |t|
    t.string "phone_number"
    t.boolean "disabled", default: false
    t.bigint "event_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_user_events_on_event_id"
    t.index ["phone_number"], name: "index_user_events_on_phone_number"
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "event_locations", "events"
  add_foreign_key "event_submissions", "events"
  add_foreign_key "user_event_locations", "user_events"
  add_foreign_key "user_events", "events"
end
