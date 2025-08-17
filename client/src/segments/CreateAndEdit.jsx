import { useContext, useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import RbA from "../components/rba/RbA";

import ActionButton from "../components/formInputs/buttons/ActionButton";
import AdminHeader from "../components/header/AdminHeader";
import AvailableAndSelectedOptions from "../components/AvailableAndSelectedOptions";
import BreadCrumb from "../components/breadCrumb/BreadCrumb";
import CheckboxButton from "../components/formInputs/buttons/CheckboxButton";
import EntitlementsDao from "../dao/EntitlementDao";
import FormReducer from "../utils/FormReducer";
import LoadingSvg from "../components/loadingSvg/LoadingSvg";
import Toolbar from "../components/Toolbar";

import { GlobalContext } from "../components/contextProvider/ContextProvider";
import { toast, ToastContainer } from "react-toastify";

import "../styles/CreateAndEdit.scss";

const CreateAndEdit = () => {
    const { action, id } = useParams();

    const { state } = useContext(GlobalContext);

    const { token } = state || {};

    const location = useLocation();
    const navigate = useNavigate();

    const selectedEntitlement =
        id && location.state?.entitlementByJobProfile ? location.state?.entitlementByJobProfile[0] : null;
    const selectedJobProfile = id && !location.state?.jobProfile ? null : location.state?.jobProfile;

    // new entitlement updatedMapping = 1
    // existing entitlement updatedMapping = 2
    // disabled entitlement updatedMapping = 5
    const initialFormState = {
        ad: {
            availableOptions: [],
            selectedOptions: []
        },
        ic: {
            availableOptions: [],
            selectedOptions: [],
            availableOptionsFlags: [],
            selectedOptionsFlags: []
        },
        google: {
            availableOptions: [],
            selectedOptions: []
        },
        selectedLocation: "", // Can be "All" or single location
        updatedMapping: action === "create" ? 1 : 2 // 1 = new, 2 = updated, 5 = disabled
    };

    const [allLocations, setAllLocations] = useState(null);
    const [checked, setChecked] = useState(false);
    const [formState, formDispatch] = useReducer(FormReducer, initialFormState);
    const [loader, setLoader] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [stopFlag, setStopFlag] = useState(false);

    const [adAvailableGroups, setAdAvailableGroups] = useState(null);
    const [adSelectedGroups, setAdSelectedGroups] = useState([]);

    const [icAvailableGroups, setIcAvailableGroups] = useState(null);
    const [icAvailableGroupsFlags, setIcAvailableGroupsFlags] = useState(null);

    const [googleAvailableGroups, setGoogleAvailableGroups] = useState(null);
    const [googleSelectedGroups, setGoogleSelectedGroups] = useState([]);

    const [icSelectedGroups, setIcSelectedGroups] = useState([]);
    const [icSelectedGroupsFlags, setIcSelectedGroupsFlags] = useState([]);

    const allowedRolesArray = ["FISCHER_ADMIN"];

    useEffect(() => {
        if (token && !allLocations) {
            setLoader(true);
            const options = {
                action: "allLocationsRead",
                token
            };
            EntitlementsDao(options).then((response) => {
                if (response) {
                    setLoader(false);
                    const { payload } = response.data;
                    if (payload) {
                        setAllLocations(payload);
                    }
                }
            });
        }
    }, [allLocations, token]);

    const handleChecked = () => {
        const newChecked = !checked;
        const updated = action === "create" ? 1 : 2;
        setChecked(newChecked);

        formDispatch({
            type: "text",
            field: "updatedMapping",
            payload: newChecked ? 5 : updated // 5 = disabled, 2 = updated, 1 = created
        });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        let tempValue;

        if (name === "selectedLocation") {
            tempValue = value;
        } else {
            tempValue = [value];
        }
        formDispatch({
            type: "text",
            field: name,
            payload: tempValue
        });
    };

    const handleSubmit = () => {
        let data = {};
        let apiAction = "";
        const icSelectedSubmitValues = formState.ic.selectedOptions?.map((str) => {
            const objMatch = icAvailableGroups?.find((group) => group.key === str);

            return objMatch.value;
        });
        const formattedAd = formState.ad.selectedOptions?.join("|");
        const formattedIc = icSelectedSubmitValues.join("|");
        const formattedIcFlags = formState.ic.selectedOptionsFlags.join("|");
        const googleFormatted = formState.google.selectedOptions?.join("|");

        let location = formState.selectedLocation ? formState.selectedLocation : null;
        let adGroups = formState.ad.selectedOptions?.length > 0 ? formattedAd : null;
        let icGroups = formattedIc?.length > 0 ? formattedIc : null;
        let icDistrictAssignmentFlags = formState.ic.selectedOptionsFlags?.length > 0 ? formattedIcFlags : null;
        let googleGroups = formState.google?.selectedOptions?.length > 0 ? googleFormatted : null;

        // EDIT
        if (id && action === "edit") {
            apiAction = "entitlementsUpdatePut";
            const { jobFamilyGroup, jobProfile } = selectedEntitlement;
            data = {
                key: id,
                jobFamilyGroup: jobFamilyGroup ? jobFamilyGroup : null,
                jobProfile: jobProfile ? jobProfile : null,
                location,
                adGroups,
                icGroups,
                icDistrictAssignmentFlags,
                googleGroups,
                updatedMapping: formState.updatedMapping
            };
        }
        // CREATE
        else {
            apiAction = "entitlementsUpdatePost";
            data = {
                key: null,
                jobFamilyGroup: selectedJobProfile && selectedJobProfile.length > 0 ? selectedJobProfile[1][0] : null,
                jobProfile: selectedJobProfile && selectedJobProfile.length > 0 ? selectedJobProfile[0] : null,
                location,
                adGroups,
                icGroups,
                icDistrictAssignmentFlags,
                googleGroups,
                updatedMapping: formState.updatedMapping
            };
        }
        const options = {
            action: apiAction,
            data,
            key: id && action === "edit" ? id : null,
            token
        };
        EntitlementsDao(options).then((response) => {
            if (response) {
                const { payload } = response.data;
                if (payload) {
                    if (id && action === "edit") {
                        toast.success(
                            `Successfully updated entitlements for Job Profile: ${selectedEntitlement?.jobProfile}`
                        );
                    } else if (selectedJobProfile && selectedJobProfile.length > 0) {
                        toast.success(
                            `Successfully created new entitlement(s) for Job Profile: ${selectedJobProfile[0]}`
                        );
                    }
                    setLoader(true);
                    setTimeout(() => {
                        navigate("/manage");
                    }, 4000);
                }
            }
        });
    };
    /**
     * Get all school locations (so user can select a location to view entitlements [dropdown])
     * EDIT
     */
    useEffect(() => {
        if (token && !allLocations) {
            setLoader(true);
            const options = {
                action: "allLocationsRead",
                token
            };
            EntitlementsDao(options).then((response) => {
                if (response) {
                    setLoader(false);
                    const { payload } = response.data;
                    if (payload) {
                        let locationObj = Object.entries(payload).map((location) => {
                            const [key, value] = location;
                            return { key, value };
                        });
                        locationObj.sort((a, b) => a.key.localeCompare(b.key));
                        setAllLocations(locationObj);
                    }
                }
            });
        }
    }, [allLocations, token]);

    /**
     * Get AD available groups (left side list)(array)
     * EDIT & CREATE
     */
    useEffect(() => {
        if (token && !adAvailableGroups) {
            setLoader(true);
            const options = {
                action: "adAvailableGroupsRead",
                token
            };
            EntitlementsDao(options).then((response) => {
                if (response) {
                    setLoader(false);
                    const { payload } = response.data;
                    if (payload) {
                        setAdAvailableGroups(payload);
                    }
                }
            });
        }
    }, [adAvailableGroups, token]);

    /**
     * Get IC available groups (left side list)(object)
     */
    useEffect(() => {
        if (token && !icAvailableGroups) {
            setLoader(true);
            const options = {
                action: "icAvailableGroupsRead",
                token
            };
            EntitlementsDao(options).then((response) => {
                if (response) {
                    setLoader(false);
                    const { payload } = response.data;
                    if (payload) {
                        let locationObj = Object.entries(payload).map((location) => {
                            const [key, value] = location;
                            return { key, value };
                        });
                        locationObj.sort((a, b) => a.key.localeCompare(b.key));
                        // Need to manually add in DEFAULT, old tool also has it hardcoded
                        locationObj.unshift({ key: "DEFAULT", value: "DEFAULT" });

                        setIcAvailableGroups(locationObj);
                    }
                }
            });
        }
    }, [icAvailableGroups, token]);

    /**
     * Get Flags from IC to show in Available Options & Selected Options (array)
     */
    useEffect(() => {
        if (token && !icAvailableGroupsFlags) {
            const options = {
                action: "icFlagsGroupsRead",
                token
            };
            EntitlementsDao(options).then((response) => {
                if (response) {
                    const { payload } = response.data;
                    if (payload) {
                        setIcAvailableGroupsFlags(payload);
                    }
                }
            });
        }
    }, [icAvailableGroupsFlags, token]);

    /**
     * Get GOOGLE available groups (left side list) (array)
     */
    useEffect(() => {
        if (token && !googleAvailableGroups) {
            setLoader(true);
            const options = {
                action: "googleAvailableGroupsRead",
                token
            };
            EntitlementsDao(options).then((response) => {
                if (response) {
                    setLoader(false);
                    const { payload } = response.data;
                    if (payload) {
                        setGoogleAvailableGroups(payload);
                    }
                }
            });
        }
    }, [googleAvailableGroups, token]);

    /**
     * Get all Selected Options per Job ID (right side list) (object)
     */
    useEffect(() => {
        if (
            adAvailableGroups &&
            icAvailableGroups &&
            googleAvailableGroups &&
            id &&
            action === "edit" &&
            !selectedOption
        ) {
            const options = {
                action: "selectedOptionsById",
                key: selectedEntitlement?.key,
                token
            };
            EntitlementsDao(options).then((response) => {
                if (response) {
                    const { payload } = response.data;
                    if (payload) {
                        setSelectedOption(payload);
                    }
                }
            });
        }
    }, [
        action,
        adAvailableGroups,
        googleAvailableGroups,
        icAvailableGroups,
        id,
        selectedEntitlement,
        selectedOption,
        token
    ]);

    /**
     * If we have AD | IC | IC Flags | Google available groups, then dispatch it to formState - (Available Options - left side)
     */
    useEffect(() => {
        const tempFormState = { ...formState };
        if (id && action === "edit") {
            if (selectedOption) {
                const { adGroups, icGroups, icDistrictAssignmentFlags, googleGroups } = selectedOption;

                // AD Groups remove duplicates
                if (adAvailableGroups && adSelectedGroups) {
                    const adGroupsArr = adGroups?.split("|").filter((item) => item.trim() !== "");
                    const removeDuplicates = adAvailableGroups?.filter((item) => !adGroupsArr?.includes(item));

                    tempFormState.ad.availableOptions = removeDuplicates;
                }
                // IC Groups remove duplicates
                if (icAvailableGroups && icSelectedGroups) {
                    const removeDuplicates = icAvailableGroups.filter(
                        (item) => !icGroups?.split("|").includes(item.value)
                    );

                    tempFormState.ic.availableOptions = removeDuplicates;
                }
                // IC Flags Groups remove duplicates
                if (icAvailableGroupsFlags && icSelectedGroupsFlags) {
                    const icFlagsArr = icDistrictAssignmentFlags?.split("|").filter((item) => item.trim() !== "");
                    const removeDuplicates = icAvailableGroupsFlags?.filter((item) => !icFlagsArr?.includes(item));

                    tempFormState.ic.availableOptionsFlags = removeDuplicates;
                }
                // GOOGLE Groups remove duplicates
                if (googleAvailableGroups && googleSelectedGroups) {
                    const googleGroupArr = googleGroups?.split("|").filter((item) => item.trim() !== "");
                    const removeDuplicates = googleAvailableGroups?.filter((item) => !googleGroupArr?.includes(item));

                    tempFormState.google.availableOptions = removeDuplicates;
                }
                formDispatch({
                    type: "reset",
                    payload: tempFormState
                });
            }
        } else {
            // CREATE
            if (adAvailableGroups) {
                tempFormState.ad.availableOptions = adAvailableGroups;
            }
            if (icAvailableGroups) {
                tempFormState.ic.availableOptions = icAvailableGroups;
            }
            if (icAvailableGroupsFlags) {
                tempFormState.ic.availableOptionsFlags = icAvailableGroupsFlags;
            }
            if (googleAvailableGroups) {
                tempFormState.google.availableOptions = googleAvailableGroups;
            }
            formDispatch({
                type: "reset",
                payload: tempFormState
            });
        }
        // eslint-disable-next-line
    }, [
        adAvailableGroups,
        adSelectedGroups,
        googleAvailableGroups,
        googleSelectedGroups,
        icAvailableGroups,
        icSelectedGroupsFlags,
        selectedOption,
        icAvailableGroupsFlags,
        icSelectedGroups
    ]);

    /**
     * If we have the following values from DB, then dispatch them to formState (Selected Options - right side)
     * - adGroups
     * - icGroups
     * - googleGroups
     */
    useEffect(() => {
        if (selectedOption) {
            const { adGroups, googleGroups, icGroups, icDistrictAssignmentFlags, location } = selectedOption;
            let findSchoolName;
            let locationName;

            if (adSelectedGroups !== "" && adGroups !== null && !stopFlag) {
                setStopFlag(true);
                const getAdValues = adGroups?.split("|").filter((value) => value.trim() !== "");
                setAdSelectedGroups(getAdValues);
            }
            if (icSelectedGroups !== "" && icGroups !== null && !stopFlag) {
                setStopFlag(true);
                const getIcValues = icGroups?.split("|");
                const findIcNames = icAvailableGroups.filter((item) => getIcValues.includes(item.value));
                const showIcNames = findIcNames.map((item) => item.key);
                setIcSelectedGroups(showIcNames);
            }
            if (icSelectedGroupsFlags !== "" && icDistrictAssignmentFlags !== null && !stopFlag) {
                setStopFlag(true);
                const getIcFlagValues = icDistrictAssignmentFlags?.split("|").filter((value) => value.trim() !== "");
                setIcSelectedGroupsFlags(getIcFlagValues);
            }
            if (googleSelectedGroups !== "" && googleGroups !== null && !stopFlag) {
                setStopFlag(true);
                const getGoogleValues = googleGroups?.split("|").filter((value) => value.trim() !== "");
                setGoogleSelectedGroups(getGoogleValues);
            }
            if (allLocations) {
                if (location && location !== "All") {
                    findSchoolName = allLocations?.find((item) => item.value === selectedOption?.location);
                    locationName = findSchoolName.value;
                }
                if (location && location === "All") {
                    locationName = "All";
                }
            }
            formDispatch({
                type: "reset",
                payload: {
                    ...formState,
                    ad: {
                        ...formState.ad,
                        selectedOptions: adSelectedGroups
                    },
                    ic: {
                        ...formState.ic,
                        selectedOptions: icSelectedGroups,
                        selectedOptionsFlags: icSelectedGroupsFlags
                    },
                    google: {
                        ...formState.google,
                        selectedOptions: googleSelectedGroups
                    },
                    selectedLocation: locationName
                }
            });
        }
        // eslint-disable-next-line
    }, [
        adSelectedGroups,
        allLocations,
        googleAvailableGroups,
        googleSelectedGroups,
        icAvailableGroups,
        icAvailableGroupsFlags,
        icSelectedGroups,
        icSelectedGroupsFlags,
        selectedOption,
        stopFlag
    ]);

    /**
     * Showing a checkmark or not
     * Updating the disabled checkbox at top of page
     * 1 = new, 2 = updated, 5 = disabled
     */
    useEffect(() => {
        if (selectedOption && selectedOption.updatedMapping) {
            const mapping = selectedOption.updatedMapping;

            setChecked(mapping === 5); // true if disabled
            let updated = action === "create" ? 1 : 2;
            if (mapping === 5) {
                updated = 5;
            }
            formDispatch({
                type: "text",
                field: "updatedMapping",
                payload: updated
            });
        }
    }, [action, selectedOption]);

    useEffect(() => {
        if (action && action === "edit" && !id) {
            navigate("/notFound");
        }
        if (action && action === "create" && id) {
            navigate("/notFound");
        }
    }, [action, id, navigate]);

    return (
        <RbA allowedRoles={allowedRolesArray}>
            <AdminHeader />
            <ToastContainer style={{ width: "50%" }} />
            <Toolbar showBackButton={allowedRolesArray.includes("FISCHER_ADMIN")} />
            <BreadCrumb label="Fischer Entitlements > Manage Entitlements" />
            {action === "edit" && id && !loader && (
                <div className="white-background-container gutter-95">
                    <h4>Manage Job Profile Entitlements for:</h4>
                    <hr />
                    <div className="entitlement-info">
                        <div>
                            Job Profile: <span className="profile">{selectedEntitlement.jobProfile}</span>
                        </div>
                        <div>
                            Job Type: <span className="type">{selectedEntitlement.jobFamilyGroup}</span>
                        </div>
                        <div>
                            Id: <span className="id">{selectedEntitlement.key}</span>
                        </div>
                    </div>
                    <div className="mt-3">
                        <CheckboxButton handleChange={handleChecked} isChecked={checked} label="Disable Entitlement" />
                    </div>

                    <div className="white-background-container-shadow select-location-container">
                        <h4>Manage Job Profile Entitlements for:</h4>
                        <div>
                            Please select &quot;All Locations&quot; OR select the specific school you wish to manage
                        </div>
                        <hr />
                        <label className="sr-only" htmlFor="allLocations">
                            Select a Location:
                        </label>
                        <select
                            className="select"
                            id="selectedLocation"
                            name="selectedLocation"
                            onChange={handleChange}
                            value={formState.selectedLocation}
                        >
                            <option value="">- Select a Location -</option>
                            <option value="All">- All Locations -</option>
                            {allLocations &&
                                allLocations.map((item, index) => {
                                    const uniqueKey = `employee-${item.key}-${index}`;
                                    return (
                                        <option key={uniqueKey} value={item.value}>
                                            {item.key.toUpperCase()}
                                        </option>
                                    );
                                })}
                        </select>
                        <br />
                        <br />
                        <AvailableAndSelectedOptions
                            accordionLabel="AD Groups"
                            label1="Available Options:"
                            label2="Selected Options:"
                            name="ad"
                            payload={formState.ad}
                            formDispatch={formDispatch}
                        />
                        <AvailableAndSelectedOptions
                            accordionLabel="IC Groups"
                            label1="Available Options"
                            label2="Selected Options:"
                            label3="Flags"
                            name="ic"
                            payload={formState.ic}
                            formDispatch={formDispatch}
                        />
                        <AvailableAndSelectedOptions
                            accordionLabel="Google Groups"
                            label1="Available Options"
                            label2="Selected Options:"
                            name="google"
                            payload={formState.google}
                            formDispatch={formDispatch}
                        />
                        <div className="mt-5">
                            <ActionButton
                                className="action-button-150"
                                disable={!formState.selectedLocation || formState.selectedLocation === ""}
                                onClick={handleSubmit}
                            >
                                Save
                            </ActionButton>
                            <ActionButton
                                className="action-button-reg-ghost"
                                onClick={() => {
                                    navigate("/manage");
                                }}
                            >
                                Cancel
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}
            {!id && !loader && (
                <div className="white-background-container gutter-95">
                    <h4>Manage Job Profile Entitlements for:</h4>
                    <hr />
                    <div className="entitlement-info">
                        <div>
                            Job Profile:{" "}
                            {selectedJobProfile && selectedJobProfile.length > 0 && (
                                <span className="profile">{selectedJobProfile[0]}</span>
                            )}
                        </div>
                        <div>
                            Job Type:{" "}
                            {selectedJobProfile && selectedJobProfile.length > 0 && (
                                <span className="type">{selectedJobProfile[1]}</span>
                            )}
                        </div>
                    </div>
                    <div className="mt-3">
                        <CheckboxButton handleChange={handleChecked} isChecked={checked} label="Disable Entitlement" />
                    </div>

                    <div className="white-background-container-shadow select-location-container">
                        <h4>Manage Job Profile Entitlements for:</h4>
                        <div>
                            Please select &quot;All Locations&quot; OR select the specific school you wish to create
                            entitlements
                        </div>
                        <hr />
                        <label className="sr-only" htmlFor="allLocations">
                            Select a Location:
                        </label>
                        <select
                            className="select"
                            id="selectedLocation"
                            name="selectedLocation"
                            onChange={handleChange}
                            value={formState.selectedLocation}
                        >
                            <option value="">- Select a Location -</option>
                            <option value="All">- All Locations -</option>
                            {allLocations &&
                                allLocations.map((item, index) => {
                                    const uniqueKey = `employee-${item.key}-${index}`;
                                    return (
                                        <option key={uniqueKey} value={item.value}>
                                            {item.key.toUpperCase()}
                                        </option>
                                    );
                                })}
                        </select>
                        <br />
                        <br />
                        <AvailableAndSelectedOptions
                            accordionLabel="AD Groups"
                            label1="Available Options:"
                            label2="Selected Options:"
                            name="ad"
                            payload={formState.ad}
                            formDispatch={formDispatch}
                        />
                        <AvailableAndSelectedOptions
                            accordionLabel="IC Groups"
                            label1="Available Options"
                            label2="Selected Options:"
                            label3="Flags"
                            name="ic"
                            payload={formState.ic}
                            formDispatch={formDispatch}
                        />
                        <AvailableAndSelectedOptions
                            accordionLabel="Google Groups"
                            label1="Available Options"
                            label2="Selected Options:"
                            name="google"
                            payload={formState.google}
                            formDispatch={formDispatch}
                        />
                        <div className="mt-5">
                            <ActionButton
                                className="action-button-150"
                                disable={!formState.selectedLocation || formState.selectedLocation === ""}
                                onClick={handleSubmit}
                            >
                                Save
                            </ActionButton>
                            <ActionButton
                                className="action-button-reg-ghost"
                                onClick={() => {
                                    navigate("/manage");
                                }}
                            >
                                Cancel
                            </ActionButton>
                        </div>
                    </div>
                </div>
            )}
            {loader && <LoadingSvg />}
        </RbA>
    );
};

export default CreateAndEdit;
