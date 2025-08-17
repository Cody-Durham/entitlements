import { useEffect, useState } from "react";
import { PropTypes } from "prop-types";

import Accordion from "react-bootstrap/Accordion";
import ActionButton from "./formInputs/buttons/ActionButton";

import "../styles/AvailableAndSelectedOptions.scss";

const AvailableAndSelectedOptions = ({ accordionLabel, label1, label2, label3, name, payload, formDispatch }) => {
    const [availableArr, setAvailableArr] = useState([]);
    const [selectedArr, setSelectedArr] = useState([]);

    const [availableOptions, setAvailableOptions] = useState(payload.availableOptions || []);
    const [availableOptionsFlags, setAvailableOptionsFlags] = useState(payload.availableOptionsFlags || []);
    const [availableFlagsArr, setAvailableFlagsArr] = useState([]);

    const [selectedOptions, setSelectedOptions] = useState(payload.selectedOptions || []);
    const [selectedOptionsFlags, setSelectedOptionsFlags] = useState(payload.selectedOptionsFlags || []);
    const [selectedFlagsArr, setSelectedFlagsArr] = useState([]);

    const handleAddChange = (e) => {
        const { value } = e.target;

        setAvailableArr([...availableArr, value]);
    };
    const handleRemoveChange = (e) => {
        const { value } = e.target;
        setSelectedArr([...selectedArr, value]);
    };

    const handleFlagsAddChange = (e) => {
        const { value } = e.target;
        setAvailableFlagsArr([...availableFlagsArr, value]);
    };
    const handleFlagsRemoveChange = (e) => {
        const { value } = e.target;

        setSelectedFlagsArr([...selectedFlagsArr, value]);
    };

    /**
     * @name handleAdd
     * moving one option from "available options" to "selected options"
     * reset formState
     */
    const handleAdd = (name) => {
        setAvailableArr([]);
        const selectedElements = document.querySelectorAll("#adAvailableOptions option:checked");
        const selectedValues = Array.from(selectedElements).map((el) => (name === "ic" ? el.innerHTML : el.value));

        if (selectedValues.length === 0) return;

        if (["ic"].includes(name)) {
            const updatedAvailable = (availableOptions || []).filter((option) => !selectedValues.includes(option.key));
            const updatedSelected = [...new Set([...(payload.selectedOptions || []), ...selectedValues])].sort((a, b) =>
                a.localeCompare(b)
            );

            formDispatch({
                type: "updateOptions",
                field: name,
                payload: {
                    availableOptions: updatedAvailable,
                    availableOptionsFlags: payload.availableOptionsFlags,
                    selectedOptions: updatedSelected,
                    selectedOptionsFlags: payload.selectedOptionsFlags
                }
            });
        } else {
            const updatedAvailable = availableOptions.filter((option) => !selectedValues.includes(option));
            // move selected (available option) over to Selected Option / remove any duplicate values
            const updatedSelected = [...new Set([...payload.selectedOptions, ...selectedValues])].sort((a, b) =>
                a.localeCompare(b)
            );

            formDispatch({
                type: "updateOptions",
                field: name,
                payload: {
                    availableOptions: updatedAvailable,
                    selectedOptions: updatedSelected
                }
            });
        }
        // Deselect all options
        Array.from(selectedElements).forEach((option) => (option.selected = false));
    };

    /**
     * @name handleRemove
     * moving one option from "selected options" to "available options"
     * reset formState
     */
    const handleRemove = (name) => {
        setSelectedArr([]);
        const selectedElements = document.querySelectorAll("#selectedOptions option:checked");
        const selectedValues = Array.from(selectedElements).map((el) => (name === "ic" ? el.innerHTML : el.value));

        if (selectedValues.length === 0) return;

        // remove selected option and update formState
        const updatedSelected = payload.selectedOptions.filter((option) => !selectedValues.includes(option));

        // move selected (selected option) over to Available Option / remove any duplicate values
        if (["ad", "google"].includes(name)) {
            const updatedAvailable = Array.from(new Set([...payload.availableOptions, ...selectedValues]))?.sort(
                (a, b) => a.localeCompare(b)
            );

            formDispatch({
                type: "updateOptions",
                field: name,
                payload: {
                    availableOptions: updatedAvailable,
                    availableOptionsFlags: payload.availableOptionsFlags,
                    selectedOptions: updatedSelected,
                    selectedOptionsFlags: payload.selectedOptionsFlags
                }
            });
        } else {
            const updatedAvailable = [...availableOptions, ...selectedValues.map((val) => ({ key: val }))];
            let sorted = updatedAvailable.sort((a, b) => {
                return a.key > b.key ? 1 : -1;
            });
            const findDefault = sorted.find((item) => item?.key === "DEFAULT");
            if (findDefault) {
                sorted.unshift(findDefault);
            }

            formDispatch({
                type: "updateOptions",
                field: name,
                payload: {
                    availableOptions: updatedAvailable,
                    availableOptionsFlags: payload.availableOptionsFlags,
                    selectedOptions: updatedSelected,
                    selectedOptionsFlags: payload.selectedOptionsFlags
                }
            });
        }

        // Deselect all options
        Array.from(selectedElements).forEach((option) => (option.selected = false));
    };

    /**
     * @name handleAddIcFlags
     * moving one option from "available options" to "selected options" in the "FLAGS" section
     * reset formState
     */
    const handleAddIcFlags = () => {
        setAvailableFlagsArr([]);

        const selectedElements = document.querySelectorAll("#adAvailableOptionsFlags option:checked");
        const selectedValues = Array.from(selectedElements).map((el) => el.value);

        if (selectedValues.length === 0) return;
        // remove available (selection) and update formState
        const updatedAvailable = payload.availableOptionsFlags.filter((option) => !selectedValues.includes(option));

        // Remove selected
        const updatedSelected = [...new Set([...payload.selectedOptionsFlags, ...selectedValues])].sort((a, b) =>
            a.localeCompare(b)
        );

        formDispatch({
            type: "updateOptions",
            field: name,
            payload: {
                availableOptions: payload.availableOptions,
                availableOptionsFlags: updatedAvailable,
                selectedOptions: payload.selectedOptions,
                selectedOptionsFlags: updatedSelected
            }
        });

        // Deselect all options
        Array.from(selectedElements).forEach((option) => (option.selected = false));
    };

    /**
     * @name handleRemoveIcFlags
     * moving one option from "selected options" to "available options"
     * reset formState
     */
    const handleRemoveIcFlags = () => {
        setSelectedFlagsArr([]);

        const selectedElements = document.querySelectorAll("#selectedOptionsFlags option:checked");
        const selectedValues = Array.from(selectedElements).map((el) => el.value);

        if (selectedValues.length === 0) return;

        // Remove selected flags
        const updatedSelected = selectedOptionsFlags.filter((option) => !selectedValues.includes(option));

        // Add removed flags back to available flags, avoiding duplicates
        const updatedAvailable = Array.from(new Set([...availableOptionsFlags, ...selectedValues]))
            .map(String)
            .sort((a, b) => a.localeCompare(b));

        // Update global form state
        formDispatch({
            type: "updateOptions",
            field: name,
            payload: {
                availableOptions: payload.availableOptions,
                selectedOptions: payload.selectedOptions,
                availableOptionsFlags: updatedAvailable,
                selectedOptionsFlags: updatedSelected
            }
        });
        // Deselect all options
        Array.from(selectedElements).forEach((option) => (option.selected = false));
    };

    /**
     * @name truncate
     * @param {*} string
     * @returns
     */
    const truncate = (string) => {
        if (string && string.length > 28) {
            return string.substring(0, 28) + "...";
        } else {
            return string;
        }
    };

    useEffect(() => {
        setAvailableOptions(payload.availableOptions || []);
        setAvailableOptionsFlags(payload.availableOptionsFlags || []);

        setSelectedOptions(payload.selectedOptions || []);
        setSelectedOptionsFlags(payload.selectedOptionsFlags || []);
    }, [
        payload.availableOptions,
        payload.availableOptionsFlags,
        payload.selectedOptions,
        payload.selectedOptionsFlags
    ]);

    return (
        <div className="mt-3">
            <Accordion className="accordion-container">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <h5>{accordionLabel}</h5>
                    </Accordion.Header>
                    <Accordion.Body className="accordion-body">
                        <div className="group-background">
                            <div className="group-container">
                                <div className="label">{label1}</div>
                                <div className="availableSelected-group">
                                    <form>
                                        <label className="sr-only" htmlFor="adAvailableOptions">
                                            Available Options:
                                        </label>
                                        <select
                                            className="options-buttons"
                                            id="adAvailableOptions"
                                            multiple
                                            name={`${name}-available`}
                                            onChange={handleAddChange}
                                        >
                                            {availableOptions.map((item, index) => {
                                                if (typeof item === "string") {
                                                    // AD & IC Flags & Google
                                                    return (
                                                        <option
                                                            className="action-button-group"
                                                            key={index}
                                                            draggable="false"
                                                            value={item}
                                                        >
                                                            {item}
                                                        </option>
                                                    );
                                                }
                                                // IC
                                                else {
                                                    return (
                                                        <option
                                                            className="action-button-group"
                                                            key={index}
                                                            draggable="false"
                                                            value={item.value}
                                                        >
                                                            {item.key}
                                                        </option>
                                                    );
                                                }
                                            })}
                                        </select>
                                    </form>
                                </div>
                            </div>
                            <div className="middle">
                                <div className="add-remove-button-container">
                                    <ActionButton
                                        className="action-button-circle-green"
                                        disable={availableArr?.length < 1}
                                        label="+"
                                        onClick={() => handleAdd(name)}
                                    />
                                    <ActionButton
                                        className="action-button-circle-red"
                                        disable={selectedArr?.length < 1}
                                        label="-"
                                        onClick={() => handleRemove(name)}
                                    />
                                </div>
                            </div>
                            <div className="group-container">
                                <div className="label">{label2}</div>
                                <div className="availableSelected-group">
                                    <form>
                                        <label className="sr-only" htmlFor="selectedOptions">
                                            Selected Options:
                                        </label>
                                        <select
                                            className="options-buttons"
                                            id="selectedOptions"
                                            multiple
                                            name={`${name}-selected`}
                                            onChange={handleRemoveChange}
                                        >
                                            {selectedOptions?.map((item, index) => {
                                                if (typeof item === "string") {
                                                    return (
                                                        <option
                                                            className="action-button-group"
                                                            key={index}
                                                            value={item}
                                                        >
                                                            {item}
                                                        </option>
                                                    );
                                                }
                                            })}
                                        </select>
                                    </form>
                                </div>
                            </div>
                        </div>
                        {/* IC Flags */}
                        {label3 && (
                            <>
                                <hr />
                                <div className="group-background">
                                    <div className="group-container">
                                        <div className="label">{label3}</div>
                                        <div className="label">{label1}</div>
                                        <div className="availableSelected-group">
                                            <form>
                                                <label className="sr-only" htmlFor="adAvailableOptionsFlags">
                                                    Available Options Flags:
                                                </label>
                                                <select
                                                    className="options-buttons"
                                                    id="adAvailableOptionsFlags"
                                                    multiple
                                                    name={`${name}-flags-available`}
                                                    onChange={handleFlagsAddChange}
                                                >
                                                    {availableOptionsFlags?.length > 0 &&
                                                        availableOptionsFlags.map((item, index) => {
                                                            if (typeof item === "string") {
                                                                return (
                                                                    <option
                                                                        className="action-button-group"
                                                                        key={index}
                                                                        draggable="false"
                                                                        value={item}
                                                                    >
                                                                        {truncate(item)}
                                                                    </option>
                                                                );
                                                            }
                                                        })}
                                                </select>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="middle">
                                        <div className="add-remove-button-container">
                                            <ActionButton
                                                className="action-button-circle-green"
                                                disable={availableFlagsArr?.length < 1}
                                                label="+"
                                                onClick={handleAddIcFlags}
                                            />
                                            <ActionButton
                                                className="action-button-circle-red"
                                                disable={selectedFlagsArr?.length < 1}
                                                label="-"
                                                onClick={handleRemoveIcFlags}
                                            />
                                        </div>
                                    </div>
                                    <div className="group-container selected-flags-container">
                                        <div className="label">{label2}</div>
                                        <div className="availableSelected-group">
                                            <form>
                                                <label className="sr-only" htmlFor="selectedOptionsFlags">
                                                    Selected Options:
                                                </label>
                                                <select
                                                    className="options-buttons"
                                                    id="selectedOptionsFlags"
                                                    multiple
                                                    name={`${name}-selected-flags`}
                                                    onChange={handleFlagsRemoveChange}
                                                >
                                                    {selectedOptionsFlags?.map((item, index) => {
                                                        if (typeof item === "string") {
                                                            return (
                                                                <option
                                                                    className="action-button-group"
                                                                    key={index}
                                                                    value={item}
                                                                >
                                                                    {truncate(item)}
                                                                </option>
                                                            );
                                                        }
                                                    })}
                                                </select>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    );
};

AvailableAndSelectedOptions.propTypes = {
    accordionLabel: PropTypes.string,
    formDispatch: PropTypes.func.isRequired,
    label1: PropTypes.string,
    label2: PropTypes.string,
    label3: PropTypes.string,
    name: PropTypes.string,
    payload: PropTypes.object
};

AvailableAndSelectedOptions.defaultProps = {
    accordionLabel: "",
    label1: "",
    label2: "",
    label3: "",
    name: "",
    payload: {}
};

export default AvailableAndSelectedOptions;
