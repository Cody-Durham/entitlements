import { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import AdminHeader from "../components/header/AdminHeader";
import BreadCrumb from "../components/breadCrumb/BreadCrumb";
import EntitlementsDao from "../dao/EntitlementDao";
import FormReducer from "../utils/FormReducer";
import Icon from "../components/icon/Icon";
import LoadingSvg from "../components/loadingSvg/LoadingSvg";
import RbA from "../components/rba/RbA";
import Toolbar from "../components/Toolbar";

import { GlobalContext } from "../components/contextProvider/ContextProvider";

import "../styles/Entitlements.scss";

const ManageEntitlements = () => {
    const { state } = useContext(GlobalContext);
    const { token } = state;

    const initialFormState = {
        jobProfile: ""
    };
    const navigate = useNavigate();

    const [allJobProfiles, setAllJobProfiles] = useState(null);
    const [allLocations, setAllLocations] = useState(null);
    const [entitlementByJobProfile, setEntitlementByJobProfile] = useState(null);

    const [formState, formDispatch] = useReducer(FormReducer, initialFormState);
    const [icAvailableGroups, setIcAvailableGroups] = useState(null);
    const [jobsMissingEntitlements, setJobsMissingEntitlements] = useState(null);
    const [loader, setLoader] = useState(false);

    const allowedRolesArray = ["FISCHER_ADMIN"];

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "jobProfile") {
            const options = {
                action: "listOfEntitlementsByJobProfileRead",
                params: {
                    jobProfile: value
                },
                token
            };
            EntitlementsDao(options).then((response) => {
                if (response) {
                    const { payload } = response.data;
                    if (payload) {
                        setEntitlementByJobProfile(payload);
                        const tempFormState = { ...formState };
                        tempFormState.jobProfile = payload[0];

                        formDispatch({
                            type: "reset",
                            payload: tempFormState
                        });
                    }
                }
            });
        }
    };

    /**
     * Get all job profiles (so user can select a profile to view entitlements [dropdown])
     */
    useEffect(() => {
        if (token && !allJobProfiles) {
            setLoader(true);
            const options = {
                action: "allJobProfilesRead",
                token
            };
            EntitlementsDao(options).then((response) => {
                if (response) {
                    setLoader(false);
                    const { payload } = response.data;
                    if (payload) {
                        setAllJobProfiles(payload);
                    }
                }
            });
        }
    }, [allJobProfiles, token]);

    /**
     * Gets the list of all jobs without an entitlement
     */
    useEffect(() => {
        if (token && !jobsMissingEntitlements) {
            setLoader(true);
            const options = {
                action: "listOfJobsMissingEntitlementsRead",
                token
            };
            EntitlementsDao(options).then((response) => {
                if (response) {
                    setLoader(false);
                    const { payload } = response.data;
                    if (payload) {
                        setJobsMissingEntitlements(payload);
                    }
                }
            });
        }
    }, [jobsMissingEntitlements, token]);

    /**
     * Get IC available groups for comparison
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
                        setIcAvailableGroups(locationObj);
                    }
                }
            });
        }
    }, [icAvailableGroups, token]);

    /**
     * Get all school locations
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

    return (
        <RbA allowedRoles={allowedRolesArray}>
            <AdminHeader />
            <ToastContainer style={{ width: "50%" }} />
            <Toolbar showBackButton={allowedRolesArray.includes("FISCHER_ADMIN")} />
            <BreadCrumb label="Fischer Entitlements > Manage Entitlements" />
            {!loader && (
                <div className="gutter-90">
                    <div className="white-background-container">
                        <h5>View Current Entitlements by Job Profile</h5>
                        <div className="select-job-profile-container">
                            <label className="sr-only" htmlFor="job-profile">
                                View current fischer entitlements by job profile.
                            </label>
                            <div className="mb-2">Please select a job profile from the list of active entitlements</div>
                            <select
                                className="select"
                                id="job-profile"
                                name="jobProfile"
                                onChange={handleChange}
                                value={formState.jobProfileId}
                            >
                                <option>- Select a Job Profile -</option>
                                {allJobProfiles &&
                                    Object.entries(allJobProfiles).map((jobProfile, index) => {
                                        const uniqueKey = `${jobProfile[0]}-${index}`;
                                        const [key] = jobProfile; // key === "Job Profile string"
                                        return (
                                            <option key={uniqueKey} value={key}>
                                                {jobProfile[0]}
                                            </option>
                                        );
                                    })}
                            </select>
                        </div>
                        {entitlementByJobProfile && (
                            <div className="current-entitlement-table mt-5">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Edit</th>
                                            <th>Location</th>
                                            <th>Job Family Group</th>
                                            <th>Job Profile</th>
                                            <th>AD Groups</th>
                                            <th>IC Groups</th>
                                            <th>IC District Assignments Flags</th>
                                            <th>Google Groups</th>
                                            <th>Updated Mapping</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entitlementByJobProfile?.length > 0 &&
                                            entitlementByJobProfile?.map((entitlement, index) => {
                                                const {
                                                    location,
                                                    jobFamilyGroup,
                                                    jobProfile,
                                                    adGroups,
                                                    icGroups,
                                                    icDistrictAssignmentFlags,
                                                    googleGroups,
                                                    updatedMapping
                                                } = entitlement;
                                                const uniqueKey = `entitlement-${entitlement.key}-${index}`;
                                                const stripe = index % 2 === 0 ? "" : "stripe";

                                                const formatIcGroups = icGroups?.split("|");

                                                const matchingIcGroups = formatIcGroups?.map((item) => {
                                                    const match = icAvailableGroups?.find((obj) => item === obj.value);
                                                    return match !== undefined ? match : null;
                                                });
                                                // If there is a "DEFAULT" value, push a new object on to matchingIcGroups
                                                formatIcGroups?.includes("DEFAULT")
                                                    ? matchingIcGroups.unshift({ key: "DEFAULT", value: "DEFAULT" })
                                                    : "";
                                                const matchingLocationGroup = allLocations.find(
                                                    (obj) => obj.value === location
                                                );
                                                const finalIcOutput = matchingIcGroups?.filter((item) => item !== null);

                                                return (
                                                    /* eslint-disable indent */
                                                    <tr className={stripe} key={uniqueKey}>
                                                        <td className="special-cell edit">
                                                            <button
                                                                aria-label="edit button"
                                                                className="action-button-table-edit"
                                                                onClick={() => {
                                                                    navigate(`/manage/edit/${entitlement.key}`, {
                                                                        state: { entitlementByJobProfile }
                                                                    });
                                                                }}
                                                                role="button"
                                                            >
                                                                <label className="sr-only" htmlFor="edit">
                                                                    Edit
                                                                </label>
                                                                <Icon
                                                                    id="edit"
                                                                    fill="#0669B3"
                                                                    height={17}
                                                                    iconName="EDIT"
                                                                    width={17}
                                                                />
                                                            </button>
                                                        </td>
                                                        <td className="special-cell">
                                                            {matchingLocationGroup?.key
                                                                ? matchingLocationGroup?.key
                                                                : "All"}
                                                        </td>
                                                        <td className="special-cell">
                                                            {jobFamilyGroup === "" ? "-" : jobFamilyGroup}
                                                        </td>
                                                        <td className="special-cell job-name">
                                                            {jobProfile === "" ? "-" : jobProfile}
                                                        </td>
                                                        <td className="special-cell">
                                                            {adGroups
                                                                ?.split("|")
                                                                .filter((val) => val !== "")
                                                                .map((group, index) => {
                                                                    return (
                                                                        <ul key={index}>
                                                                            <li>{group}</li>
                                                                        </ul>
                                                                    );
                                                                })}
                                                        </td>
                                                        <td className="special-cell">
                                                            {finalIcOutput
                                                                ? finalIcOutput?.map((obj, index) => {
                                                                      return (
                                                                          <ul key={index}>
                                                                              <li>{obj.key}</li>
                                                                          </ul>
                                                                      );
                                                                  })
                                                                : "-"}
                                                        </td>
                                                        <td className="special-cell">
                                                            {icDistrictAssignmentFlags
                                                                ? icDistrictAssignmentFlags
                                                                      ?.split("|")
                                                                      .filter((val) => val !== "")
                                                                      .map((flag, index) => {
                                                                          return (
                                                                              <ul key={index}>
                                                                                  <li>{flag}</li>
                                                                              </ul>
                                                                          );
                                                                      })
                                                                : "-"}
                                                        </td>
                                                        <td className="special-cell">
                                                            {googleGroups
                                                                ? googleGroups
                                                                      ?.split("|")
                                                                      .filter((val) => val !== "")
                                                                      .map((group, index) => {
                                                                          return (
                                                                              <ul key={index}>
                                                                                  <li>{group}</li>
                                                                              </ul>
                                                                          );
                                                                      })
                                                                : "-"}
                                                        </td>
                                                        <td className="special-cell-mapping">
                                                            {updatedMapping === "" ? "-" : updatedMapping}
                                                        </td>
                                                    </tr>
                                                    /* eslint-disable indent */
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                    <hr className="mt-5 mb-5" />
                    <div className="job-profiles-missing-entitlements">
                        Active Job Profiles Missing Fischer Entitlements
                    </div>
                    <div className="current-entitlement-table mt-3 mb-5">
                        <table>
                            <thead>
                                <tr className="sticky-top">
                                    <th>Setup Entitlements</th>
                                    <th>Job Profile</th>
                                    <th>Job Family Group</th>
                                </tr>
                            </thead>
                            <tbody>
                                {jobsMissingEntitlements &&
                                    Object.entries(jobsMissingEntitlements).map((job, index) => {
                                        const uniqueKey = `job-${job[0]}-${index}`;
                                        const stripe = index % 2 === 0 ? "" : "stripe";
                                        return (
                                            <tr className={stripe} key={uniqueKey}>
                                                <td className="setup-entitlement-column">
                                                    <button
                                                        aria-label="edit button"
                                                        className="action-button-table-edit"
                                                        onClick={() => {
                                                            navigate(`/manage/create`, {
                                                                state: { jobProfile: job }
                                                            });
                                                        }}
                                                        role="button"
                                                    >
                                                        <label className="sr-only" htmlFor="add">
                                                            Create
                                                        </label>
                                                        <Icon id="add" height={20} iconName="ADD" width={20} />
                                                    </button>
                                                </td>
                                                <td>{job[0]}</td>
                                                <td>{job[1]}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {loader && <LoadingSvg />}
        </RbA>
    );
};

export default ManageEntitlements;
