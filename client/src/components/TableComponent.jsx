import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import Icon from "./icon/Icon";

import "../styles/Reprocess.scss";

const TableComponent = ({ formDispatch, formState, handleSort, sortStateButton, setSortStateButton, tableData }) => {
    const [expandedRows, setExpandedRows] = useState([]);
    const [headerData, setHeaderData] = useState([]);

    const toggleRowExpand = (recordId) => {
        setExpandedRows((prev) =>
            prev.includes(recordId) ? prev.filter((id) => id !== recordId) : [...prev, recordId]
        );
    };

    const getRowChecked = useCallback(
        (rowId) => {
            const { selectedRowData } = formState || null;
            if (!selectedRowData) {
                return false;
            }

            return parseInt(selectedRowData.recordId, 10) === parseInt(rowId, 10);
        },
        [formState]
    );

    const getRowId = (row) => {
        return row?.recordId;
    };

    const handleCheckmark = (e, row) => {
        formDispatch({
            type: "reset",
            payload: { ...formState, selectedRowData: e.target.checked ? { ...row } : null }
        });
    };

    /**
     * Set each table column headers depending on the userType (employees, guardians, students)
     */
    useEffect(() => {
        if (formState.userType === "employees") {
            setHeaderData([
                { key: "select", label: "Select" },
                { key: "addlInfo", label: "Addl Info" },
                { key: "recordStatus", label: "Record Status" },
                { key: "employeeId", label: "Employee Id" },
                { key: "userName", label: "Username" },
                { key: "lastName", label: "Last Name" },
                { key: "firstName", label: "First Name" },
                { key: "middleName", label: "Middle Name" },
                { key: "employeeStatus", label: "Employee Status" },
                { key: "isPrimary", label: "Primary" },
                { key: "locationExternalIdAbbreviation", label: "Loc Abbr" },
                { key: "recordCreateDate", label: "Created Date" },
                { key: "recordId", label: "Record Id" }
            ]);
        }
        if (formState.userType === "guardians") {
            setHeaderData([
                { key: "select", label: "Select" },
                { key: "addlInfo", label: "Addl Info" },
                { key: "recordStatus", label: "Record Status" },
                { key: "personId", label: "Person Id" },
                { key: "userName", label: "Username" },
                { key: "lastName", label: "Last Name" },
                { key: "firstName", label: "First Name" },
                { key: "middleName", label: "Middle Name" },
                { key: "studentNumbers", label: "Student Numbers" },
                { key: "recordCreateDate", label: "Created Date" },
                { key: "recordId", label: "Record ID" }
            ]);
        }
        if (formState.userType === "students") {
            setHeaderData([
                { key: "select", label: "Select" },
                { key: "addlInfo", label: "Addl Info" },
                { key: "recordStatus", label: "Record Status" },
                { key: "studentNumber", label: "Student ID" },
                { key: "userName", label: "Username" },
                { key: "lastName", label: "Last Name" },
                { key: "firstName", label: "First Name" },
                { key: "middleName", label: "Middle Name" },
                { key: "grade", label: "Grade" },
                { key: "school", label: "School" },
                { key: "enrollmentStart", label: "Enrollment Start Date" },
                { key: "enrollmentEnd", label: "Enrollment End Date" },
                { key: "recordCreateDate", label: "Created Date" },
                { key: "recordId", label: "Record ID" }
            ]);
        }
    }, [formState]);

    return (
        <div className="current-entitlement-table">
            <table>
                <thead>
                    <tr>
                        {headerData.map((header, index) => {
                            return (
                                <th className="sticky-top" key={`header-${index}`}>
                                    <div className="column-header-button-container">
                                        {header.label}
                                        {!["select", "addlInfo", "school"].includes(header.key) && (
                                            <div className="sort-buttons-container">
                                                <button
                                                    aria-label="Up Arrow"
                                                    name="up"
                                                    onClick={() => {
                                                        handleSort("asc", header.key);
                                                        setSortStateButton({ columnKey: header.key, direction: "asc" });
                                                    }}
                                                >
                                                    <Icon
                                                        height={12}
                                                        id="dcsd-icon"
                                                        fill="#0669B3"
                                                        iconName={
                                                            sortStateButton.columnKey === header.key &&
                                                            sortStateButton.direction === "asc"
                                                                ? "CHEVRON_UP_FILL"
                                                                : "CHEVRON_UP"
                                                        }
                                                        width={12}
                                                    />
                                                </button>
                                                <button
                                                    aria-label="Down Arrow"
                                                    name="down"
                                                    onClick={() => {
                                                        handleSort("desc", header.key);
                                                        setSortStateButton({
                                                            columnKey: header.key,
                                                            direction: "desc"
                                                        });
                                                    }}
                                                >
                                                    <Icon
                                                        height={12}
                                                        id="dcsd-icon"
                                                        fill="#0669B3"
                                                        iconName={
                                                            sortStateButton.columnKey === header.key &&
                                                            sortStateButton.direction === "desc"
                                                                ? "CHEVRON_DOWN_FILL"
                                                                : "CHEVRON_DOWN"
                                                        }
                                                        width={12}
                                                    />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, rowIndex) => {
                        const uniqueKey1 = `row-${rowIndex}`;
                        const stripe = rowIndex % 2 === 0 ? "" : "stripe";
                        const isThisRowExpanded = expandedRows.includes(row.recordId);
                        return (
                            <React.Fragment key={uniqueKey1}>
                                <tr className={stripe}>
                                    {headerData.map((header, colIndex) => {
                                        const uniqueKey2 = `cell-${colIndex}`;
                                        if (header.key === "select") {
                                            // accessibility
                                            const rowId = getRowId(row);
                                            // accessibility
                                            const inputId = `row-select-${rowId}`;
                                            return (
                                                <td
                                                    key={uniqueKey2}
                                                    style={{ textAlign: "center", verticalAlign: "middle" }}
                                                >
                                                    <label htmlFor={inputId} className="sr-only">
                                                        Select Row
                                                    </label>
                                                    <input
                                                        type="radio"
                                                        id={inputId} // accessibility
                                                        name="row-select"
                                                        checked={getRowChecked(rowId)}
                                                        onChange={(e) => {
                                                            handleCheckmark(e, row);
                                                        }}
                                                        style={{ width: "18px", height: "18px" }}
                                                    />
                                                </td>
                                            );
                                        }
                                        if (header.key === "addlInfo") {
                                            return (
                                                <td key={uniqueKey2} style={{ textAlign: "center" }}>
                                                    <button
                                                        aria-label="toggle-note"
                                                        onClick={() => toggleRowExpand(row.recordId)}
                                                        style={{ border: "none", background: "none" }}
                                                    >
                                                        <Icon
                                                            height={20}
                                                            id="dcsd-icon"
                                                            iconName={isThisRowExpanded ? "VIEW" : "NO_VIEW"}
                                                            width={20}
                                                        />
                                                    </button>
                                                </td>
                                            );
                                        }
                                        if (formState.userType !== "employees") {
                                            if (header.key === "recordCreateDate") {
                                                return (
                                                    <td key={uniqueKey2} style={{ textAlign: "center" }}>
                                                        {row.recordCreateDate.split(" ")[0]}
                                                    </td>
                                                );
                                            }
                                        }
                                        // turn on (render) all of the rows
                                        return <td key={uniqueKey2}>{row[header.key] ?? ""}</td>;
                                    })}
                                </tr>
                                {/* Additional Information hidden / dropdown div */}
                                {isThisRowExpanded && formState.userType === "employees" && (
                                    <tr className="expanded-row">
                                        <td colSpan={headerData.length}>
                                            <div className="expanded-content open">
                                                <div className="main-container-titlebar">
                                                    Additional User Information
                                                </div>
                                                <div className="info-container">
                                                    <div className="left-container">
                                                        <div className="more-info">
                                                            Work Email:<span>{row.emailWork}</span>
                                                        </div>
                                                        <div className="more-info">
                                                            Employee Type:<span>{row.employeeType}</span>
                                                        </div>
                                                        <div className="more-info">
                                                            Hire Date:<span>{row.hireDate?.split(" ")[0]}</span>
                                                        </div>
                                                        <div className="more-info">
                                                            Termination Date:
                                                            <span>{row.terminationDate?.split(" ")[0]}</span>
                                                        </div>
                                                        <div className="more-info">
                                                            Position ID:<span>{row.positionId}</span>
                                                        </div>
                                                        <div className="more-info">
                                                            Job Code:<span>{row.jobCode}</span>
                                                        </div>
                                                    </div>
                                                    <div className="right-container">
                                                        <div className="more-info">
                                                            Person ID:<span>{row.personId}</span>
                                                        </div>
                                                        <div className="more-info">
                                                            Job Family Group:<span>{row.jobFamilyGroup}</span>
                                                        </div>
                                                        <div className="more-info">
                                                            Job Profile Name:<span>{row.jobProfileName}</span>
                                                        </div>
                                                        <div className="more-info">
                                                            Assignment Start Date:
                                                            <span>{row.assignmentStartDate?.split(" ")[0]}</span>
                                                        </div>
                                                        <div className="more-info">
                                                            Assignment End Date:
                                                            <span>{row.assignmentEndDate?.split(" ")[0]}</span>
                                                        </div>
                                                        <div className="more-info">
                                                            Location Name:<span>{row.locationName}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {isThisRowExpanded && formState.userType === "guardians" && (
                                    <tr>
                                        <td colSpan={headerData.length}>
                                            <div className="main-container-titlebar">Additional User Information</div>
                                            <div className="info-container">
                                                <div className="left-container">
                                                    <div className="more-info">
                                                        Work Phone:<span>{row.workPhone}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Cell Phone:<span>{row.cellPhone}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Home Phone:<span>{row.homePhone}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Other Phone:<span>{row.otherPhone}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Email:<span>{row.email}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Address Number:<span>{row.addressNumber}</span>
                                                    </div>
                                                </div>
                                                <div className="right-container">
                                                    <div className="more-info">
                                                        Address Prefix:<span>{row.addressPrefix}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Street:<span>{row.streetName}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Tag:<span>{row.streetTag}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Dir:<span>{row.streetDir}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Apt:<span>{row.apt}</span>
                                                    </div>
                                                </div>
                                                <div className="right-container">
                                                    <div className="more-info">
                                                        City:<span>{row.city}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        State:<span>{row.state}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Zip:<span>{row.zip}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Guardian Guid:<span>{row.guardianGUID}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}

                                {isThisRowExpanded && formState.userType === "students" && (
                                    <tr>
                                        <td colSpan={headerData.length}>
                                            <div className="main-container-titlebar">Additional User Information</div>
                                            <div className="info-container">
                                                <div className="left-container">
                                                    <div className="more-info">
                                                        Person ID:<span>{row.personId}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Birthdate:<span>{row.birthDate}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        CDE Code:<span>{row.cdeCode}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        School End Year:<span>{row.endYear}</span>
                                                    </div>
                                                    <div className="more-info">
                                                        Google OU:<span>{row.googleOU}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

TableComponent.propTypes = {
    formDispatch: PropTypes.func.isRequired,
    formState: PropTypes.oneOfType([PropTypes.object]),
    handleSort: PropTypes.func.isRequired,
    sortStateButton: PropTypes.oneOfType([PropTypes.object]),
    setSortStateButton: PropTypes.func.isRequired,
    tableData: PropTypes.instanceOf(Array).isRequired
};

export default TableComponent;
