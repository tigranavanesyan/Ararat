import { RegisterOptions } from "react-hook-form"

const EmailValidation = {
    required: "The field must be filled",
    pattern: {
        value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<,>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, //eslint-disable-line
        message: "Invalid email"
    },
}

const PasswordValidation: RegisterOptions = {
    required: "The field must be filled",
    minLength: {
        value: 6,
        message: "Password must be more than 6 characters"
    },
}

const LevelValidation: RegisterOptions = {
    required: "The field must be filled",
    min: {
        value: 1,
        message: "Password must be from 1 to 10"
    },
    max: {
        value: 10,
        message: "Password must be from 1 to 10"
    },
}

export { EmailValidation, PasswordValidation, LevelValidation }