class AddDualDatabase < ActiveRecord::Migration[7.0]
  def change
    drop_table :saral_locatable_ad_ac_mappings, if_exists: true
    drop_table :saral_locatable_location_type_last_syncs, if_exists: true
    drop_table :saral_locatable_ad_m_corporation_mappings, if_exists: true
    drop_table :saral_locatable_ad_m_council_mappings, if_exists: true
    drop_table :saral_locatable_ad_nagar_panchayat_mappings, if_exists: true
    drop_table :saral_locatable_ad_pc_mappings, if_exists: true
    drop_table :saral_locatable_ad_ac_mappings, if_exists: true
    drop_table :saral_locatable_ad_tp_mappings, if_exists: true
    drop_table :saral_locatable_administrative_district_gram_panchayat_mappings, if_exists: true
    drop_table :saral_locatable_administrative_district_mandal_mappings, if_exists: true
    drop_table :saral_locatable_administrative_district_zila_mappings, if_exists: true
    drop_table :saral_locatable_administrative_district_zila_panchayat_mappings, if_exists: true
    drop_table :saral_locatable_state_region_mappings, if_exists: true
    drop_table :saral_locatable_assembly_constituency_mandal_mappings, if_exists: true
    drop_table :saral_locatable_parliamentary_constituency_mandal_mappings, if_exists: true
    drop_table :saral_locatable_zila_mandal_mappings, if_exists: true
    drop_table :saral_locatable_zila_panchayat_wards, if_exists: true
    drop_table :saral_locatable_zila_panchayats, if_exists: true
    drop_table :saral_locatable_shakti_kendra_booth_mappings, if_exists: true
    drop_table :saral_locatable_booth_mandal_mappings, if_exists: true
    drop_table :saral_locatable_booth_zila_mappings, if_exists: true
    drop_table :saral_locatable_booth_administrative_district_mappings, if_exists: true
    drop_table :saral_locatable_administrative_districts, if_exists: true
    drop_table :saral_locatable_state_region_mappings, if_exists: true
    drop_table :saral_locatable_state_zone_zila_mappings, if_exists: true
    drop_table :saral_locatable_urban_local_body_ward_mappings, if_exists: true
    drop_table :saral_locatable_wards, if_exists: true
    drop_table :saral_locatable_uploaded_files, if_exists: true
    drop_table :saral_locatable_taluka_panchayat_wards, if_exists: true
    drop_table :saral_locatable_taluka_panchayat_gram_panchayat_mappings, if_exists: true
    drop_table :saral_locatable_taluka_panchayats, if_exists: true
    drop_table :saral_locatable_regions, if_exists: true
    drop_table :saral_locatable_nagar_panchayats, if_exists: true
    drop_table :saral_locatable_municipal_councils, if_exists: true
    drop_table :saral_locatable_municipal_corporations, if_exists: true
    drop_table :saral_locatable_mapping_locators, if_exists: true
    drop_table :saral_locatable_gram_panchayat_wards, if_exists: true
    drop_table :saral_locatable_gram_panchayats, if_exists: true
    drop_table :sso_client_keys, if_exists: true
    drop_table :saral_locatable_zilas, if_exists: true
    drop_table :saral_locatable_shakti_kendras, if_exists: true
    drop_table :saral_locatable_mandals, if_exists: true
    drop_table :saral_locatable_booths, if_exists: true
    drop_table :saral_locatable_state_zones, if_exists: true
    drop_table :saral_locatable_assembly_constituencies, if_exists: true
    drop_table :saral_locatable_parliamentary_constituencies, if_exists: true
    drop_table :saral_locatable_states, if_exists: true
  end
end