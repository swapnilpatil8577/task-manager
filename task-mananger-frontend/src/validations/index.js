const isValidEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
};

export const validate = (group, name, value) => {

    if (group === "signup") {
        switch (name) {
            case "name": {
                if (!value) return "Name is required";
                return null;
            }
            case "email": {
                if (!value) return "Email is required";
                if (!isValidEmail(value)) 
                    return "Please enter valid email address";
                return null;
            }
            case "password": {
                if (!value) return "Password is required";
                if (value.length < 8) 
                    return "Password should be atleast 8 chars long";
                return null;
            }
            default: return null;
        }
    } else if (group === "login") {
        switch (name) {
            case "email": {
                if (!value) return "Email is required";
                if (!isValidEmail(value)) 
                    return "Please enter valid email address";
                return null;
            }
            case "password": {
                if (!value) return "Password is required";
                return null;
            }
            default: return null;
        }
    } else if (group === "task") {
        switch (name) {
            case "title": {
                if (!value) return "Title is required";
                return null;
            }
            case "description": {
                if (!value) return "Description is required";
                if (value.length > 100) return "Max. limit is 100 characters.";
                return null;
            }
            case "dueDate": {
                if (!value) return "Due Date is required";
                return null;
            }
            default: return null;
        }
    } else {
        return null;
    }
}

const validateManyFields = (group, list) => {
    const errors = [];
    for (const field in list) {
        const err = validate(group, field, list[field]);
        if (err) errors.push({ field, err });
    }
    return errors;
}
 
export default validateManyFields;