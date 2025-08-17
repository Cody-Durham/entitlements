export const FE_SERVICE = "/fischer/v0";

export const ALL_JOB_PROFILES_READ = `${FE_SERVICE}/reference_data/job_profiles_with_entitlements`; // <index.json>
export const ALL_LOCATIONS_READ = `${FE_SERVICE}/reference_data/location_names/index.json`;
export const CREATE_FISCHER_ENTITLEMENTS = `${FE_SERVICE}/entitlements/detail.json`;
export const FISCHER_ENTITLEMENT_BY_ID = `${FE_SERVICE}/entitlements`; // <id>/details.json
export const LIST_OF_ENTITLEMENTS_BY_JOB_PROFILE = `${FE_SERVICE}/entitlements/search/index.json`;
export const LIST_OF_JOBS_MISSING_ENTITLEMENTS = `${FE_SERVICE}/reference_data/setup/job_profiles/index.json`;
export const REPROCESS_READ = `${FE_SERVICE}/person/search`; // <userType>/index.json?searchString<param>
export const REPROCESS_SUBMIT = `${FE_SERVICE}/person`; // /<userType>/update

// Group calls
export const AD_AVAILABLE_GROUPS_READ = `${FE_SERVICE}/reference_data/ad_group_names/index.json`;
export const GOOGLE_AVAILABLE_GROUPS_READ = `${FE_SERVICE}/reference_data/google_group_names/index.json`;
export const IC_AVAILABLE_GROUPS_READ = `${FE_SERVICE}/reference_data/ic_group_names/index.json`;
export const IC_FLAGS_GROUPS_READ = `${FE_SERVICE}/reference_data/ic_flag_names/index.json`;
