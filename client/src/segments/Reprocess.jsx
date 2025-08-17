import { useCallback, useContext, useEffect, useReducer, useState } from "react";
import { toast, ToastContainer } from "react-toastify";

import AdminHeader from "../components/header/AdminHeader";
import BreadCrumb from "../components/breadCrumb/BreadCrumb";
import LoadingSvg from "../components/loadingSvg/LoadingSvg";
import RbA from "../components/rba/RbA";
import Toolbar from "../components/Toolbar";

import ActionButton from "../components/formInputs/buttons/ActionButton";
import EntitlementsDao from "../dao/EntitlementDao";
import FormReducer from "../utils/FormReducer";
import TableComponent from "../components/TableComponent";

import { GlobalContext } from "../components/contextProvider/ContextProvider";
import { getEndYearOnly } from "../utils/DateFormatter";

import "../styles/Reprocess.scss";

const Reprocess = () => {
    const { state } = useContext(GlobalContext);
    const { schoolYearDto, token } = state || {};

    const initialFormState = {
        searchString: "",
        selectedRowData: null,
        userType: "employees"
    };

    const [defaultHeaderSort, setDefaultHeaderSort] = useState(
        "lastName,firstName,employeeId,employeeStatus,-recordId"
    );
    const [formState, formDispatch] = useReducer(FormReducer, initialFormState);
    const [incorrectSearchString, setIncorrectSearchString] = useState(false);
    const [loader, setLoader] = useState(false);
    const [sortState, setSortState] = useState("lastName,firstName,employeeId,employeeStatus,-recordId");
    const [sortStateButton, setSortStateButton] = useState({ columnKey: "lastName", direction: "asc" });
    const [tableData, setTableData] = useState(null);

    const capitalizeUserType = formState.userType?.charAt(0)?.toUpperCase() + formState.userType?.slice(1); // For UI Display

    const allowedRolesArray = ["FISCHER_ADMIN"];

    const clearInput = () => {
        formDispatch({
            type: "reset",
            payload: { ...formState, searchString: "", selectedRowData: null }
        });
        setIncorrectSearchString(false);
        setSortStateButton({ columnKey: "lastName", direction: "asc" });
    };

    /**
     * @name handleSearch
     * @description With a given sort order, search for users
     * @param {string} sortOrder
     */
    const handleSearch = useCallback(
        async (sortOrder) => {
            try {
                const schoolYearEndDate = getEndYearOnly(schoolYearDto?.endDate);
                setLoader(true);

                const options = {
                    action: "reprocessRead",
                    params: {
                        endYear: formState.userType === "students" ? schoolYearEndDate : null,
                        maxRecords: 500,
                        searchString: formState.searchString,
                        sortOrder
                    },
                    token,
                    userType: formState.userType
                };
                const response = await EntitlementsDao(options);
                if (response && response.data) {
                    setLoader(false);
                    const { payload } = response.data;
                    setTableData(payload || null);
                    if (!payload) {
                        setIncorrectSearchString(true);
                        setTableData(null);
                    }
                }
            } catch (error) {
                console.error(error);
                setIncorrectSearchString(true);
                setTableData(null);
            } finally {
                setLoader(false);
            }
        },
        [formState, schoolYearDto, token]
    );

    const handleSort = (dir, header) => {
        const prefix = dir === "desc" ? "-" : "";
        let tmpSort = defaultHeaderSort;
        switch (header) {
            case "employeeId": // userType = employees
                tmpSort = `${prefix}${header},lastName,firstName,employeeStatus,-recordId`;
                break;
            case "employeeStatus": // userType = employees
                tmpSort = `${prefix}${header},lastName,firstName,employeeId,-recordId`;
                break;
            case "firstName": // userType = any
                if (formState.userType === "employees") {
                    tmpSort = `${prefix}${header},lastName,employeeId,employeeStatus,-recordId`;
                } else if (formState.userType === "guardians") {
                    tmpSort = `${prefix}${header},lastName,personId,-recordId`;
                } else {
                    // students
                    tmpSort = `${prefix}${header},lastName,studentNumber,-recordId`;
                }
                break;
            case "lastName": // userType = any
                if (formState.userType === "employees") {
                    tmpSort = `${prefix}${header},firstName,employeeId,employeeStatus,-recordId`;
                } else if (formState.userType === "guardians") {
                    tmpSort = `${prefix}${header},firstName,personId,-recordId`;
                } else {
                    // students
                    tmpSort = `${prefix}${header},firstName,studentNumber,-recordId`;
                }
                break;
            case "personId": // userType = guardians
                tmpSort = `${prefix}${header},lastName,firstName,-recordId`;
                break;
            case "recordId": // userType = any
                if (formState.userType === "employees") {
                    tmpSort = `${prefix}${header},lastName,firstName,employeeId,employeeStatus`;
                } else if (formState.userType === "guardians") {
                    tmpSort = `${prefix}${header},lastName,firstName,personId`;
                } else {
                    // students
                    tmpSort = `${prefix}${header},lastName,firstName,studentNumber`;
                }
                break;
            case "studentNumber": // userType = students
                tmpSort = `${prefix}${header},lastName,firstName,-recordId`;
                break;
            default:
                tmpSort = `${prefix}${header},${defaultHeaderSort}`;
                break;
        }
        handleSearch(tmpSort);
        setSortState(tmpSort);
    };

    /**
     * @name handleChange
     * @param {*} e
     * Responsible for dispatching userType into formState
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name !== "searchString") {
            if (name === "employees") {
                setDefaultHeaderSort("lastName,firstName,employeeId,employeeStatus,-recordId");
                setSortState("lastName,firstName,employeeId,employeeStatus,-recordId");
            } else if (name === "guardians") {
                setDefaultHeaderSort("lastName,firstName,personId,-recordId");
                setSortState("lastName,firstName,personId,-recordId");
            } else {
                // students
                setDefaultHeaderSort("lastName,firstName,studentNumber,-recordId");
                setSortState("lastName,firstName,studentNumber,-recordId");
            }
            setTableData([]);
            clearInput();

            formDispatch({
                type: "text",
                field: "userType",
                payload: name
            });
        } else if (name === "searchString") {
            formDispatch({
                type: "text",
                field: name,
                payload: value
            });
        }
    };

    const handleSubmit = useCallback(() => {
        const { firstName, lastName, recordId } = formState.selectedRowData;
        const data = [recordId];
        const options = {
            action: "reprocessSubmit",
            data,
            token,
            userType: formState.userType
        };
        EntitlementsDao(options).then((response) => {
            if (response) {
                handleSearch(sortState);
                toast.success(
                    `Request to reprocess record ID ${recordId} for ${firstName} ${lastName} initiated successfully`,
                    {
                        autoClose: 10000
                    }
                );
                formDispatch({
                    type: "reset",
                    payload: { ...formState, selectedRowData: null }
                });
            }
        });
    }, [formState, handleSearch, sortState, token]);

    /**
     * @name DisplayCorrectSearchType
     * @returns message. depending on userType
     */
    const displayCorrectSearchType = () => {
        let message = "";
        if (formState.userType === "employees") {
            message = "Search by Employee ID, Last Name, or Username";
        }
        if (formState.userType === "guardians") {
            message = "Search by Person ID, Last Name, or Username";
        }
        if (formState.userType === "students") {
            message = "Search by Student ID or Last Name";
        }
        return message;
    };

    /**
     * Reset selectedRowData when searchString is empty
     * Otherwise it persists until the next selected row is chosen
     */
    useEffect(() => {
        const { searchString } = formState;
        if (searchString.trim().length === 0) {
            setSortStateButton({ columnKey: "lastName", direction: "asc" });
            const tempFormState = formState;
            tempFormState.selectedRowData = null;

            formDispatch({
                type: "reset",
                payload: { ...tempFormState }
            });
        }
        // eslint-disable-next-line
    }, [formState.searchString]);

    return (
        <RbA allowedRoles={allowedRolesArray} redirect="/notFound">
            <AdminHeader />
            <ToastContainer style={{ width: "50%" }} />
            <Toolbar showBackButton={allowedRolesArray.includes("FISCHER_ADMIN")} />
            <BreadCrumb label="Fischer Entitlements > Reprocess Users" />
            <div className="gutter-90">
                <div className="white-background-container">
                    <h5>Select User Type to Reprocess</h5>
                    <hr />
                    <div className="radio-single-container">
                        <input
                            checked={formState.userType === "employees"}
                            id="employees"
                            name="employees"
                            onChange={handleChange}
                            type="radio"
                            value="employees"
                        />
                        <label htmlFor="employees" className="radio-label">
                            Employees
                        </label>
                    </div>
                    <div className="radio-single-container">
                        <input
                            checked={formState.userType === "guardians"}
                            id="guardians"
                            name="guardians"
                            onChange={handleChange}
                            type="radio"
                            value="guardians"
                        />
                        <label htmlFor="guardians" className="radio-label">
                            Guardians
                        </label>
                    </div>
                    <div className="radio-single-container">
                        <input
                            checked={formState.userType === "students"}
                            id="students"
                            name="students"
                            onChange={handleChange}
                            type="radio"
                            value="students"
                        />
                        <label htmlFor="students" className="radio-label">
                            Students
                        </label>
                    </div>
                    <hr />
                    <br />
                    <div className="overall-reprocess-container">
                        <h5>
                            Reprocess <span className="highlight">{capitalizeUserType}</span>
                        </h5>
                        <div className="search-container">
                            <label htmlFor="searchString">{displayCorrectSearchType()}</label>
                            <div className="input-container">
                                <input
                                    id="searchString"
                                    name="searchString"
                                    onChange={handleChange}
                                    type="text"
                                    value={formState.searchString}
                                />
                                <ActionButton
                                    disable={formState.searchString.trim() === ""}
                                    label="Search"
                                    onClick={() => {
                                        handleSearch(defaultHeaderSort);
                                    }}
                                />
                                {tableData?.length > 0 && (
                                    <ActionButton
                                        className="action-button-reg-ghost-long"
                                        disable={formState.searchString.trim() === ""}
                                        label="Clear Search Results"
                                        onClick={() => {
                                            setTableData(null);
                                            clearInput();
                                        }}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    {tableData && tableData.length > 0 && (
                        <>
                            <div className="found-text-container">
                                <div className="found-text-large">Found {tableData.length} records</div>
                                <div className="found-text">
                                    Select applicable row and click &quot;Reprocess Selected&quot; at the bottom of the
                                    page to reset their Record Statuses to &quot;New&quot;
                                </div>
                            </div>
                            <hr />
                            <TableComponent
                                formState={formState}
                                formDispatch={formDispatch}
                                handleSort={handleSort}
                                sortStateButton={sortStateButton}
                                setSortStateButton={setSortStateButton}
                                tableData={tableData}
                            />
                            <ActionButton
                                className="action-button-300"
                                disable={!formState.selectedRowData}
                                label="Reprocess Selected Record"
                                onClick={handleSubmit}
                            />
                        </>
                    )}
                    {incorrectSearchString && tableData === null && (
                        <div className="sorry">No results found. Please refine your search and try again.</div>
                    )}
                </div>
            </div>
            {loader && <LoadingSvg />}
        </RbA>
    );
};

export default Reprocess;
