import SimpleDialog from "./modals/SimpleDialog";

/**
 * @returns a simple looking dialog to tell the user they dont have access to this page
 */
const NotFound = () => {
    return (
        <>
            <SimpleDialog message1="Page Not Found" message2="The current address is unavailable." />
            <hr className="mt-5" />
        </>
    );
};

export default NotFound;
