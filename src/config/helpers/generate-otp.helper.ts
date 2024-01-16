import * as otpGenerator from 'otp-generator'

export const generateOtp =  ()=>otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });