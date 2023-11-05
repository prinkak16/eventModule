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

ActiveRecord::Schema[7.0].define(version: 2023_11_02_121929) do
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

  create_table "app_permissions", force: :cascade do |t|
    t.string "name", null: false
    t.string "action", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "client_apps", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "data_levels", force: :cascade do |t|
    t.string "name", null: false
    t.string "level_class", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "data_types", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "event_forms", force: :cascade do |t|
    t.integer "event_id"
    t.string "form_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "event_locations", force: :cascade do |t|
    t.bigint "event_id", null: false
    t.string "location_type"
    t.bigint "location_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "state_id"
    t.index ["event_id"], name: "index_event_locations_on_event_id"
    t.index ["location_type", "location_id"], name: "index_event_locations_on_location"
  end

  create_table "event_submissions", force: :cascade do |t|
    t.string "form_id"
    t.string "submission_id"
    t.bigint "user_id", null: false
    t.bigint "event_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_id"], name: "index_event_submissions_on_event_id"
    t.index ["user_id"], name: "index_event_submissions_on_user_id"
  end

  create_table "events", force: :cascade do |t|
    t.string "name"
    t.string "image_url"
    t.bigint "data_level_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "status_aasm_state", default: "upcoming"
    t.string "event_type"
    t.integer "state_id"
    t.datetime "start_date"
    t.datetime "end_date"
    t.bigint "created_by_id", null: false
    t.datetime "deleted_at"
    t.boolean "published", default: false
    t.index ["created_by_id"], name: "index_events_on_created_by_id"
    t.index ["data_level_id"], name: "index_events_on_data_level_id"
    t.index ["deleted_at"], name: "index_events_on_deleted_at"
  end

  create_table "saral_locatable_ad_ac_mappings", id: :bigint, default: -> { "nextval('saral_locatable_administrative_district_assembly_constit_id_seq'::regclass)" }, force: :cascade do |t|
    t.bigint "saral_locatable_administrative_district_id"
    t.bigint "saral_locatable_assembly_constituency_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_administrative_district_id"], name: "ad_ac_mappings_ad_index"
    t.index ["saral_locatable_assembly_constituency_id"], name: "ac_ad_mappings_ac_index"
  end

  create_table "saral_locatable_ad_m_corporation_mappings", id: :bigint, default: -> { "nextval('saral_locatable_administrative_district_municipal_corpor_id_seq'::regclass)" }, force: :cascade do |t|
    t.bigint "saral_locatable_administrative_district_id"
    t.bigint "saral_locatable_municipal_corporation_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_administrative_district_id"], name: "ad_municipal_corporation_mappings_ad_index"
    t.index ["saral_locatable_municipal_corporation_id"], name: "municipal_corporation_ad_mappings_municipal_corporation_index"
  end

  create_table "saral_locatable_ad_m_council_mappings", id: :bigint, default: -> { "nextval('saral_locatable_administrative_district_municipal_counci_id_seq'::regclass)" }, force: :cascade do |t|
    t.bigint "saral_locatable_administrative_district_id"
    t.bigint "saral_locatable_municipal_council_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_administrative_district_id"], name: "ad_municipal_council_mappings_ad_index"
    t.index ["saral_locatable_municipal_council_id"], name: "municipal_council_ad_mappings_municipal_council_index"
  end

  create_table "saral_locatable_ad_nagar_panchayat_mappings", id: :bigint, default: -> { "nextval('saral_locatable_administrative_district_nagar_panchayat__id_seq'::regclass)" }, force: :cascade do |t|
    t.bigint "saral_locatable_administrative_district_id"
    t.bigint "saral_locatable_nagar_panchayat_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_administrative_district_id"], name: "ad_nagar_panchayat_mappings_ad_index"
    t.index ["saral_locatable_nagar_panchayat_id"], name: "nagar_panchayat_ad_mappings_nagar_panchayat_index"
  end

  create_table "saral_locatable_ad_pc_mappings", id: :bigint, default: -> { "nextval('saral_locatable_administrative_district_parliamentary_co_id_seq'::regclass)" }, force: :cascade do |t|
    t.bigint "saral_locatable_administrative_district_id"
    t.bigint "saral_locatable_parliamentary_constituency_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_administrative_district_id"], name: "ad_pc_mappings_ad_index"
    t.index ["saral_locatable_parliamentary_constituency_id"], name: "pc_ad_mappings_pc_index"
  end

  create_table "saral_locatable_ad_tp_mappings", id: :bigint, default: -> { "nextval('saral_locatable_administrative_district_taluka_panchayat_id_seq'::regclass)" }, force: :cascade do |t|
    t.bigint "saral_locatable_administrative_district_id"
    t.bigint "saral_locatable_taluka_panchayat_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_administrative_district_id"], name: "ad_taluka_panchayat_mappings_ad_index"
    t.index ["saral_locatable_taluka_panchayat_id"], name: "taluka_panchayat_ad_mappings_taluka_panchayat_index"
  end

  create_table "saral_locatable_administrative_district_gram_panchayat_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_administrative_district_id"
    t.bigint "saral_locatable_gram_panchayat_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_administrative_district_id"], name: "ad_gram_panchayat_mappings_ad_index"
    t.index ["saral_locatable_gram_panchayat_id"], name: "gram_panchayat_ad_mappings_gram_panchayat_index"
  end

  create_table "saral_locatable_administrative_district_mandal_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_administrative_district_id"
    t.bigint "saral_locatable_mandal_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_administrative_district_id"], name: "ad_mandal_mappings_ad_index"
    t.index ["saral_locatable_mandal_id"], name: "mandal_ad_mappings_mandal_index"
  end

  create_table "saral_locatable_administrative_district_zila_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_administrative_district_id"
    t.bigint "saral_locatable_zila_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_administrative_district_id"], name: "ad_zila_mappings_ad_index"
    t.index ["saral_locatable_zila_id"], name: "zila_ad_mappings_zila_index"
  end

  create_table "saral_locatable_administrative_district_zila_panchayat_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_administrative_district_id"
    t.bigint "saral_locatable_zila_panchayat_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_administrative_district_id"], name: "ad_zila_panchayat_mappings_ad_index"
    t.index ["saral_locatable_zila_panchayat_id"], name: "zila_panchayat_ad_mappings_zila_panchayat_index"
  end

  create_table "saral_locatable_administrative_districts", force: :cascade do |t|
    t.string "name"
    t.bigint "saral_locatable_state_id"
    t.boolean "is_deleted", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at", precision: nil
    t.string "svg_path"
    t.bigint "total_estimate"
    t.index ["saral_locatable_state_id"], name: "state_administrative_district_index"
  end

  create_table "saral_locatable_assembly_constituencies", force: :cascade do |t|
    t.string "name"
    t.string "number"
    t.bigint "saral_locatable_state_id"
    t.boolean "is_deleted", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "saral_locatable_parliamentary_constituency_id"
    t.datetime "deleted_at"
    t.index ["saral_locatable_parliamentary_constituency_id"], name: "ac_pc_index"
    t.index ["saral_locatable_state_id"], name: "state_assembly_constituency_index"
  end

  create_table "saral_locatable_assembly_constituency_mandal_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_assembly_constituency_id"
    t.bigint "saral_locatable_mandal_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_assembly_constituency_id"], name: "ac_m_mapping_ac_index"
    t.index ["saral_locatable_mandal_id"], name: "m_ac_mapping_m_index"
  end

  create_table "saral_locatable_booth_administrative_district_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_booth_id"
    t.bigint "saral_locatable_administrative_district_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_administrative_district_id"], name: "ad_booth_mappings_ad_index"
    t.index ["saral_locatable_booth_id"], name: "booth_ad_mappings_booth_index"
  end

  create_table "saral_locatable_booth_mandal_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_mandal_id"
    t.bigint "saral_locatable_booth_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_booth_id"], name: "b_m_mapping_b_index"
    t.index ["saral_locatable_mandal_id"], name: "b_m_mapping_m_index"
  end

  create_table "saral_locatable_booth_zila_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_booth_id"
    t.bigint "saral_locatable_zila_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_booth_id"], name: "b_z_mapping_b_index"
    t.index ["saral_locatable_zila_id"], name: "z_b_mapping_z_index"
  end

  create_table "saral_locatable_booths", force: :cascade do |t|
    t.string "name"
    t.string "number"
    t.boolean "is_deleted", default: false, null: false
    t.bigint "saral_locatable_state_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "saral_locatable_assembly_constituency_id"
    t.string "village_name"
    t.boolean "is_updating", default: false, null: false
    t.string "area_under_booth"
    t.string "panchayat"
    t.string "ward_number"
    t.string "patwar_circle"
    t.string "kanungo_circle"
    t.string "hadbast_sankhya"
    t.string "pin_code"
    t.string "post_office"
    t.string "police_station"
    t.string "block"
    t.string "revenue_division"
    t.string "tehsil"
    t.string "sub_division"
    t.string "district"
    t.datetime "deleted_at", precision: nil
    t.index ["saral_locatable_assembly_constituency_id"], name: "booth_assembly_constituency_index"
    t.index ["saral_locatable_state_id"], name: "state_booth_index"
  end

  create_table "saral_locatable_gram_panchayat_wards", force: :cascade do |t|
    t.string "name"
    t.integer "number"
    t.bigint "saral_locatable_state_id"
    t.bigint "saral_locatable_gram_panchayat_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["saral_locatable_gram_panchayat_id"], name: "gram_panchayat_gram_panchayat_ward_index"
    t.index ["saral_locatable_state_id"], name: "state_gram_panchayat_ward_index"
  end

  create_table "saral_locatable_gram_panchayats", force: :cascade do |t|
    t.string "name"
    t.bigint "saral_locatable_state_id"
    t.boolean "is_deleted", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["saral_locatable_state_id"], name: "state_gram_panchayat_index"
  end

  create_table "saral_locatable_location_type_last_syncs", force: :cascade do |t|
    t.string "location_type"
    t.datetime "last_sync"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "saral_locatable_states_id"
    t.index ["location_type"], name: "index_saral_locatable_location_type_last_syncs_on_location_type"
  end

  create_table "saral_locatable_mandals", force: :cascade do |t|
    t.string "name"
    t.bigint "saral_locatable_state_id"
    t.boolean "is_deleted", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at", precision: nil
    t.index ["saral_locatable_state_id"], name: "state_mandal_index"
  end

  create_table "saral_locatable_mapping_locators", force: :cascade do |t|
    t.string "first_table"
    t.string "second_table"
    t.string "mapping_table"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "mapping_backup_table"
  end

  create_table "saral_locatable_municipal_corporations", force: :cascade do |t|
    t.string "name"
    t.bigint "saral_locatable_state_id"
    t.boolean "is_deleted", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["saral_locatable_state_id"], name: "state_municipal_corporation_index"
  end

  create_table "saral_locatable_municipal_councils", force: :cascade do |t|
    t.string "name"
    t.bigint "saral_locatable_state_id"
    t.boolean "is_deleted", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["saral_locatable_state_id"], name: "state_municipal_council_index"
  end

  create_table "saral_locatable_nagar_panchayats", force: :cascade do |t|
    t.string "name"
    t.bigint "saral_locatable_state_id"
    t.boolean "is_deleted", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["saral_locatable_state_id"], name: "state_nagar_panchayat_index"
  end

  create_table "saral_locatable_parliamentary_constituencies", force: :cascade do |t|
    t.string "name"
    t.string "number"
    t.bigint "saral_locatable_state_id"
    t.boolean "is_deleted", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["saral_locatable_state_id"], name: "state_parliamentary_constituency_index"
  end

  create_table "saral_locatable_parliamentary_constituency_mandal_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_parliamentary_constituency_id"
    t.bigint "saral_locatable_mandal_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_mandal_id"], name: "mandal_pc_mappings_mandal_index"
    t.index ["saral_locatable_parliamentary_constituency_id"], name: "pc_mandal_mappings_pc_index"
  end

  create_table "saral_locatable_regions", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "saral_locatable_shakti_kendra_booth_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_shakti_kendra_id"
    t.bigint "saral_locatable_booth_id"
    t.string "booth_number"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_booth_id"], name: "b_sk_mapping_b_index"
    t.index ["saral_locatable_shakti_kendra_id"], name: "sk_b_mapping_sk_index"
  end

  create_table "saral_locatable_shakti_kendras", force: :cascade do |t|
    t.string "name"
    t.string "number"
    t.bigint "saral_locatable_state_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "saral_locatable_assembly_constituency_id"
    t.bigint "saral_locatable_mandal_id"
    t.integer "created_by_id"
    t.datetime "deleted_at", precision: nil
    t.integer "document_id"
    t.string "maha_system_id"
    t.index ["saral_locatable_assembly_constituency_id"], name: "shakti_kendra_assembly_constituency_index"
    t.index ["saral_locatable_mandal_id"], name: "shakti_kendra_mandal_index"
    t.index ["saral_locatable_state_id"], name: "state_shakti_kendra_index"
  end

  create_table "saral_locatable_state_region_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_state_id"
    t.bigint "saral_locatable_region_id"
    t.index ["saral_locatable_region_id"], name: "s_region_mapping_region_index"
    t.index ["saral_locatable_state_id"], name: "s_region_mapping_s_index"
  end

  create_table "saral_locatable_state_zone_zila_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_state_zone_id"
    t.bigint "saral_locatable_zila_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_state_zone_id"], name: "sz_zila_mappings_sz_index"
    t.index ["saral_locatable_zila_id"], name: "zila_sz_mappings_zila_index"
  end

  create_table "saral_locatable_state_zones", force: :cascade do |t|
    t.string "name"
    t.bigint "saral_locatable_state_id"
    t.boolean "is_deleted", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at", precision: nil
    t.index ["saral_locatable_state_id"], name: "state_sz_index"
  end

  create_table "saral_locatable_states", force: :cascade do |t|
    t.string "name"
    t.boolean "is_deleted", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "state_code"
    t.float "latitude"
    t.float "longitude"
    t.float "zoom"
    t.string "svg_path"
    t.string "capital"
    t.string "office_address"
    t.jsonb "preferences", default: {}
    t.datetime "deleted_at", precision: nil
    t.string "outer_svg_path"
  end

  create_table "saral_locatable_taluka_panchayat_gram_panchayat_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_gram_panchayat_id"
    t.bigint "saral_locatable_taluka_panchayat_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_gram_panchayat_id"], name: "index_gp_tp_mapping_on_gp_id"
    t.index ["saral_locatable_taluka_panchayat_id"], name: "index_gp_tp_mapping_on_tp_id"
  end

  create_table "saral_locatable_taluka_panchayat_wards", force: :cascade do |t|
    t.string "name"
    t.bigint "saral_locatable_state_id"
    t.bigint "saral_locatable_taluka_panchayat_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "number"
    t.datetime "deleted_at"
    t.index ["saral_locatable_state_id"], name: "state_taluka_panchayat_ward_index"
    t.index ["saral_locatable_taluka_panchayat_id"], name: "taluka_panchayat_taluka_panchayat_ward_index"
  end

  create_table "saral_locatable_taluka_panchayats", force: :cascade do |t|
    t.string "name"
    t.bigint "saral_locatable_state_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["saral_locatable_state_id"], name: "state_taluka_panchayat_index"
  end

  create_table "saral_locatable_uploaded_files", force: :cascade do |t|
    t.string "file_name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "saral_locatable_urban_local_body_ward_mappings", force: :cascade do |t|
    t.string "saral_locatable_urban_local_body_type"
    t.bigint "saral_locatable_urban_local_body_id"
    t.bigint "saral_locatable_ward_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_urban_local_body_type", "saral_locatable_urban_local_body_id"], name: "index_ulb_ward_on_ulb_id"
    t.index ["saral_locatable_ward_id"], name: "index_ulb_ward_on_ward_id"
  end

  create_table "saral_locatable_wards", force: :cascade do |t|
    t.integer "number"
    t.string "name"
    t.string "translated_name"
    t.bigint "saral_locatable_state_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["saral_locatable_state_id"], name: "state_ward_index"
  end

  create_table "saral_locatable_zila_mandal_mappings", force: :cascade do |t|
    t.bigint "saral_locatable_zila_id"
    t.bigint "saral_locatable_mandal_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["saral_locatable_mandal_id"], name: "m_z_mapping_m_index"
    t.index ["saral_locatable_zila_id"], name: "z_m_mapping_z_index"
  end

  create_table "saral_locatable_zila_panchayat_wards", force: :cascade do |t|
    t.string "name"
    t.bigint "saral_locatable_state_id"
    t.bigint "saral_locatable_zila_panchayat_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "number"
    t.datetime "deleted_at"
    t.index ["saral_locatable_state_id"], name: "state_zila_panchayat_ward_index"
    t.index ["saral_locatable_zila_panchayat_id"], name: "zila_panchayat_zila_panchayat_ward_index"
  end

  create_table "saral_locatable_zila_panchayats", force: :cascade do |t|
    t.string "name"
    t.bigint "saral_locatable_state_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["saral_locatable_state_id"], name: "state_zila_panchayat_index"
  end

  create_table "saral_locatable_zilas", force: :cascade do |t|
    t.string "name"
    t.boolean "is_deleted", default: false, null: false
    t.bigint "saral_locatable_state_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at", precision: nil
    t.index ["saral_locatable_state_id"], name: "state_zila_index"
  end

  create_table "sso_client_keys", force: :cascade do |t|
    t.string "kid", null: false
    t.text "public_key", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["kid"], name: "index_sso_client_keys_on_kid"
  end

  create_table "user_permissions", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "app_permission_id"
    t.integer "user_tag_id"
    t.integer "client_app_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_permissions_on_user_id"
  end

  create_table "user_tag_locations", force: :cascade do |t|
    t.bigint "user_tag_id"
    t.integer "location_id"
    t.string "location_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_tag_id"], name: "index_user_tag_locations_on_user_tag_id"
  end

  create_table "user_tags", force: :cascade do |t|
    t.bigint "data_type_id"
    t.bigint "data_level_id"
    t.bigint "user_id"
    t.integer "saral_tag_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["data_level_id"], name: "index_user_tags_on_data_level_id"
    t.index ["data_type_id"], name: "index_user_tags_on_data_type_id"
    t.index ["user_id"], name: "index_user_tags_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "uuid", null: false
    t.string "email", null: false
    t.string "name", null: false
    t.string "role", null: false
    t.string "phone_number", null: false
    t.jsonb "sso_payload", default: "{}", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "event_locations", "events"
  add_foreign_key "event_submissions", "events"
  add_foreign_key "event_submissions", "users"
  add_foreign_key "events", "data_levels"
  add_foreign_key "events", "users", column: "created_by_id"
  add_foreign_key "saral_locatable_ad_ac_mappings", "saral_locatable_administrative_districts"
  add_foreign_key "saral_locatable_ad_ac_mappings", "saral_locatable_assembly_constituencies"
  add_foreign_key "saral_locatable_ad_m_corporation_mappings", "saral_locatable_administrative_districts"
  add_foreign_key "saral_locatable_ad_m_corporation_mappings", "saral_locatable_municipal_corporations"
  add_foreign_key "saral_locatable_ad_m_council_mappings", "saral_locatable_administrative_districts"
  add_foreign_key "saral_locatable_ad_m_council_mappings", "saral_locatable_municipal_councils"
  add_foreign_key "saral_locatable_ad_nagar_panchayat_mappings", "saral_locatable_administrative_districts"
  add_foreign_key "saral_locatable_ad_nagar_panchayat_mappings", "saral_locatable_nagar_panchayats"
  add_foreign_key "saral_locatable_ad_pc_mappings", "saral_locatable_administrative_districts"
  add_foreign_key "saral_locatable_ad_pc_mappings", "saral_locatable_parliamentary_constituencies"
  add_foreign_key "saral_locatable_ad_tp_mappings", "saral_locatable_administrative_districts"
  add_foreign_key "saral_locatable_ad_tp_mappings", "saral_locatable_taluka_panchayats"
  add_foreign_key "saral_locatable_administrative_district_gram_panchayat_mappings", "saral_locatable_administrative_districts"
  add_foreign_key "saral_locatable_administrative_district_gram_panchayat_mappings", "saral_locatable_gram_panchayats"
  add_foreign_key "saral_locatable_administrative_district_mandal_mappings", "saral_locatable_administrative_districts"
  add_foreign_key "saral_locatable_administrative_district_mandal_mappings", "saral_locatable_mandals"
  add_foreign_key "saral_locatable_administrative_district_zila_mappings", "saral_locatable_administrative_districts"
  add_foreign_key "saral_locatable_administrative_district_zila_mappings", "saral_locatable_zilas"
  add_foreign_key "saral_locatable_administrative_district_zila_panchayat_mappings", "saral_locatable_administrative_districts"
  add_foreign_key "saral_locatable_administrative_district_zila_panchayat_mappings", "saral_locatable_zila_panchayats"
  add_foreign_key "saral_locatable_administrative_districts", "saral_locatable_states"
  add_foreign_key "saral_locatable_assembly_constituencies", "saral_locatable_parliamentary_constituencies"
  add_foreign_key "saral_locatable_assembly_constituencies", "saral_locatable_states"
  add_foreign_key "saral_locatable_assembly_constituency_mandal_mappings", "saral_locatable_assembly_constituencies"
  add_foreign_key "saral_locatable_assembly_constituency_mandal_mappings", "saral_locatable_mandals"
  add_foreign_key "saral_locatable_booth_administrative_district_mappings", "saral_locatable_administrative_districts"
  add_foreign_key "saral_locatable_booth_administrative_district_mappings", "saral_locatable_booths"
  add_foreign_key "saral_locatable_booth_mandal_mappings", "saral_locatable_booths"
  add_foreign_key "saral_locatable_booth_mandal_mappings", "saral_locatable_mandals"
  add_foreign_key "saral_locatable_booth_zila_mappings", "saral_locatable_booths"
  add_foreign_key "saral_locatable_booth_zila_mappings", "saral_locatable_zilas"
  add_foreign_key "saral_locatable_booths", "saral_locatable_assembly_constituencies"
  add_foreign_key "saral_locatable_booths", "saral_locatable_states"
  add_foreign_key "saral_locatable_gram_panchayat_wards", "saral_locatable_gram_panchayats"
  add_foreign_key "saral_locatable_gram_panchayat_wards", "saral_locatable_states"
  add_foreign_key "saral_locatable_gram_panchayats", "saral_locatable_states"
  add_foreign_key "saral_locatable_location_type_last_syncs", "saral_locatable_states", column: "saral_locatable_states_id"
  add_foreign_key "saral_locatable_mandals", "saral_locatable_states"
  add_foreign_key "saral_locatable_municipal_corporations", "saral_locatable_states"
  add_foreign_key "saral_locatable_municipal_councils", "saral_locatable_states"
  add_foreign_key "saral_locatable_nagar_panchayats", "saral_locatable_states"
  add_foreign_key "saral_locatable_parliamentary_constituencies", "saral_locatable_states"
  add_foreign_key "saral_locatable_parliamentary_constituency_mandal_mappings", "saral_locatable_mandals"
  add_foreign_key "saral_locatable_parliamentary_constituency_mandal_mappings", "saral_locatable_parliamentary_constituencies"
  add_foreign_key "saral_locatable_shakti_kendra_booth_mappings", "saral_locatable_booths"
  add_foreign_key "saral_locatable_shakti_kendra_booth_mappings", "saral_locatable_shakti_kendras"
  add_foreign_key "saral_locatable_shakti_kendras", "saral_locatable_assembly_constituencies"
  add_foreign_key "saral_locatable_shakti_kendras", "saral_locatable_mandals"
  add_foreign_key "saral_locatable_shakti_kendras", "saral_locatable_states"
  add_foreign_key "saral_locatable_state_region_mappings", "saral_locatable_regions"
  add_foreign_key "saral_locatable_state_region_mappings", "saral_locatable_states"
  add_foreign_key "saral_locatable_state_zone_zila_mappings", "saral_locatable_state_zones"
  add_foreign_key "saral_locatable_state_zone_zila_mappings", "saral_locatable_zilas"
  add_foreign_key "saral_locatable_state_zones", "saral_locatable_states"
  add_foreign_key "saral_locatable_taluka_panchayat_gram_panchayat_mappings", "saral_locatable_gram_panchayats"
  add_foreign_key "saral_locatable_taluka_panchayat_gram_panchayat_mappings", "saral_locatable_taluka_panchayats"
  add_foreign_key "saral_locatable_taluka_panchayat_wards", "saral_locatable_states"
  add_foreign_key "saral_locatable_taluka_panchayat_wards", "saral_locatable_taluka_panchayats"
  add_foreign_key "saral_locatable_taluka_panchayats", "saral_locatable_states"
  add_foreign_key "saral_locatable_urban_local_body_ward_mappings", "saral_locatable_wards"
  add_foreign_key "saral_locatable_wards", "saral_locatable_states"
  add_foreign_key "saral_locatable_zila_mandal_mappings", "saral_locatable_mandals"
  add_foreign_key "saral_locatable_zila_mandal_mappings", "saral_locatable_zilas"
  add_foreign_key "saral_locatable_zila_panchayat_wards", "saral_locatable_states"
  add_foreign_key "saral_locatable_zila_panchayat_wards", "saral_locatable_zila_panchayats"
  add_foreign_key "saral_locatable_zila_panchayats", "saral_locatable_states"
  add_foreign_key "saral_locatable_zilas", "saral_locatable_states"
  add_foreign_key "user_permissions", "users"
  add_foreign_key "user_tag_locations", "user_tags"
  add_foreign_key "user_tags", "data_levels"
  add_foreign_key "user_tags", "data_types"
  add_foreign_key "user_tags", "users"
end
