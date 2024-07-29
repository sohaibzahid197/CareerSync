const bcrypt = require("bcryptjs");
const express = require("express");
const {v4: uuidv4} = require("uuid");
const nodemailer = require("nodemailer");
const router = express.Router();

const CandidateOTPVerification = require("../models/candidateOTPVerificationSchema");
const EmployerOTPVerification = require("../models/employerOTPVerificationSchema");
const CandidatePasswordReset = require("../models/candidatePasswordResetSchema");
const EmployerPasswordReset = require("../models/employerPasswordResetSchema");
const {body, validationResult} = require("express-validator");
const Candidate = require("../models/candidateSchema");
const Employer = require("../models/employerSchema");
require("../database/connection");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.AUTHENTICATION_EMAIL,
        pass: process.env.AUTHENTICATION_PASSWORD,
    },
});

router.get('/candidate/:id', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()[0].msg});
    }
    const {id} = req.params;
    try {
        const candidateExists = await Candidate.findById(id);
        if (!candidateExists) {
            return res.status(404).json({error: "Candidate Not Found"});
        }
        res.json({message: "Candidate Found", email: candidateExists['email']});
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

router.get('/employer/:id', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({error: errors.array()[0].msg});
    }
    const {id} = req.params;
    try {
        const candidateExists = await Employer.findById(id);
        if (!candidateExists) {
            return res.status(404).json({error: "Candidate Not Found"});
        }
        res.json({message: "Candidate Found", email: candidateExists['email']});
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
});

router.post(
    "/candidate/signup",
    [
        body(
            "firstName",
            "Please Fill Out All the Fields Before Submitting"
        ).notEmpty(),
        body(
            "lastName",
            "Please Fill Out All the Fields Before Submitting"
        ).notEmpty(),
        body("email", "Please Provide A Valid Email Address").isEmail(),
        body("password", "Password Must Be At Least 6 Characters Long").isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error: errors.array()[0].msg});
        }

        const {firstName, lastName, email, password} = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res
                .status(400)
                .json({error: "Please fill out all the fields before submitting"});
        }

        try {
            const candidateExists = await Candidate.findOne({email: email});
            if (candidateExists) {
                return res.status(409).json({error: "Candidate Already Exists"});
            }

            const candidate = new Candidate({
                firstName,
                lastName,
                email,
                password,
                verified: false,
            });

            const candidateRegistration = await candidate.save();

            if (candidateRegistration) {
                const otpVerificationResult = await candidateSendOTPVerificationEmail(
                    candidateRegistration,
                    res
                );
                res.json({message: "Candidate Registered Successfully", id: candidateRegistration['_id'], email: candidateRegistration['email']});

            } else {
                return res.status(500).json({error: "Candidate Registration Failed"});
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "Internal Server Error"});
        }
    }
);

const candidateSendOTPVerificationEmail = async (candidate, res) => {
    try {
        const otp = Math.floor(`${100000 + Math.random() * 900000}`).toString();
        const htmlEmail = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification Email</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #2c3e50;">OTP Verification</h2>
    </div>
    <div style="text-align: center; margin-bottom: 20px;">
      <p style="color: #34495e; font-size: 16px;">Hello,</p>
      <p style="color: #34495e; font-size: 16px;">Your OTP Verification Code Is:</p>
      <div style="background-color: #3498db; color: #ffffff; padding: 12px 24px; border-radius: 5px; display: inline-block; font-size: 24px; margin-top: 10px;">${otp}</div>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <p style="color: #34495e; font-size: 16px;">Please Use This Code To Verify Your Account. Note That This Code Will Expire In One Minute.</p>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #7f8c8d;">
      <p style="color: #7f8c8d;">Sent By CareerSync</p>
    </div>
  </div>
</body>
</html>
    `;
        const mailOptions = {
            from: process.env.AUTHENTICATION_EMAIL,
            to: candidate.email,
            subject: "Confirm Your Email Address With CareerSync",
            html: htmlEmail,
        };
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const expirationDuration = 90000;
        const expiresAt = Date.now() + expirationDuration;
        const newOTPVerification = await new CandidateOTPVerification({
            otp: hashedOTP,
            userId: candidate._id,
            createdAt: Date.now(),
            expiresAt: expiresAt,
        });
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        const additionalInformation = {
            userId: candidate._id,
            email: candidate.email,
        };
        return {
            status: "PENDING",
            message: "Verification OTP Email Sent",
            additionalInformation: additionalInformation,
        };
    } catch (error) {
        console.error("Error sending OTP verification email:", error);
        return {
            status: "FAILED",
            message: "Failed to send OTP verification email",
        };
    }
};

router.post(
    "/candidate/signin",
    [
        body(
            "email",
            "Please Fill Out All the Fields Before Submitting"
        ).notEmpty(),
        body(
            "password",
            "Please Fill Out All the Fields Before Submitting"
        ).notEmpty(),
        body("email", "Please Provide A Valid Email Address").isEmail(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error: errors.array()[0].msg});
        } else {
            try {
                const {email, password} = req.body;
                if (!email || !password) {
                    return res.status(400).json({
                        error: "Please Fill Out All the Fields Before Submitting",
                    });
                }
                const candidateLogin = await Candidate.findOne({email: email});
                if (!candidateLogin) {
                    return res.status(404).json({error: "Candidate Not Found"});
                }
                const isMatch = await bcrypt.compare(password, candidateLogin.password);
                if (!isMatch) {
                    return res.status(401).json({error: "Invalid Credentials"});
                }
                const token = await candidateLogin.generateAuthenticationToken();
                res.cookie("jwtToken", token, {
                    expires: new Date(Date.now() + 2592000000),
                    httpOnly: true,
                });
                res.json({message: "Candidate Sign In Successfully", id: candidateLogin['_id'], email: candidateLogin['email']});
            } catch (error) {
                console.error(error);
                res.status(500).json({error: "Internal Server Error"});
            }
        }
    }
);

router.post(
    "/employer/signup",
    [
        body(
            "firstName",
            "Please Fill Out All the Fields Before Submitting"
        ).notEmpty(),
        body(
            "lastName",
            "Please Fill Out All the Fields Before Submitting"
        ).notEmpty(),
        body("email", "Please Provide A Valid Email Address").isEmail(),
        body("password", "Password Must Be At Least 6 Characters Long").isLength({
            min: 6,
        }),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error: errors.array()[0].msg});
        }

        const {firstName, lastName, email, password} = req.body;
        if (!firstName || !lastName || !email || !password) {
            return res
                .status(400)
                .json({error: "Please fill out all the fields before submitting"});
        }

        try {
            const employerExists = await Employer.findOne({email: email});
            if (employerExists) {
                return res.status(409).json({error: "Employer Already Exists"});
            }

            const employer = new Employer({
                firstName,
                lastName,
                email,
                password,
                verified: false,
            });

            const employerRegistration = await employer.save();

            if (employerRegistration) {
                const otpVerificationResult = await employerSendOTPVerificationEmail(
                    employerRegistration,
                    res
                );
                return res.json({message: "Employer Registered Successfully", id: employerRegistration['_id'], email: employerRegistration['email']});
            } else {
                return res.status(500).json({error: "Employer Registration Failed"});
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({error: "Internal Server Error"});
        }
    }
);

const employerSendOTPVerificationEmail = async (employer, res) => {
    try {
        const otp = Math.floor(`${100000 + Math.random() * 900000}`).toString();
        const htmlEmail = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification Email</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #2c3e50;">OTP Verification</h2>
    </div>
    <div style="text-align: center; margin-bottom: 20px;">
      <p style="color: #34495e; font-size: 16px;">Hello,</p>
      <p style="color: #34495e; font-size: 16px;">Your OTP Verification Code Is:</p>
      <div style="background-color: #3498db; color: #ffffff; padding: 12px 24px; border-radius: 5px; display: inline-block; font-size: 24px; margin-top: 10px;">${otp}</div>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <p style="color: #34495e; font-size: 16px;">Please Use This Code To Verify Your Account. Note That This Code Will Expire In One Minute.</p>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #7f8c8d;">
      <p style="color: #7f8c8d;">Sent By CareerSync</p>
    </div>
  </div>
</body>
</html>
    `;
        const mailOptions = {
            from: process.env.AUTHENTICATION_EMAIL,
            to: employer.email,
            subject: "Confirm Your Email Address With CareerSync",
            html: htmlEmail,
        };
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);
        const expirationDuration = 60000;
        const expiresAt = Date.now() + expirationDuration;
        const newOTPVerification = await new EmployerOTPVerification({
            otp: hashedOTP,
            userId: employer._id,
            createdAt: Date.now(),
            expiresAt: expiresAt,
        });
        await newOTPVerification.save();
        await transporter.sendMail(mailOptions);
        const additionalInformation = {
            userId: employer._id,
            email: employer.email,
        };
        return {
            status: "PENDING",
            message: "Verification OTP Email Sent",
            additionalInformation: additionalInformation,
        };
    } catch (error) {
        console.error("Error sending OTP verification email:", error);
        return {
            status: "FAILED",
            message: "Failed to send OTP verification email",
        };
    }
};

router.post(
    "/employer/signin",
    [
        body(
            "email",
            "Please Fill Out All the Fields Before Submitting"
        ).notEmpty(),
        body(
            "password",
            "Please Fill Out All the Fields Before Submitting"
        ).notEmpty(),
        body("email", "Please Provide A Valid Email Address").isEmail(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({error: errors.array()[0].msg});
        } else {
            try {
                const {email, password} = req.body;
                if (!email || !password) {
                    return res.status(400).json({error: "All Fields Are Required"});
                }
                const employerLogin = await Employer.findOne({email: email});
                if (!employerLogin) {
                    return res.status(404).json({error: "Employer Not Found"});
                }
                const isMatch = await bcrypt.compare(password, employerLogin.password);
                const token = await employerLogin.generateAuthenticationToken();
                res.cookie("jwtToken", token, {
                    expires: new Date(Date.now() + 2592000000),
                    httpOnly: true,
                });
                if (!isMatch) {
                    return res.status(401).json({error: "Invalid Credentials"});
                }
                res.json({message: "Employer Sign In Successfully"});
            } catch (error) {
                console.error(error);
                res.status(500).json({error: "Internal Server Error"});
            }
        }
    }
);

router.post("/candidate/verifyOTP", async (req, res) => {
    try {
        let {userId, otp} = req.body;
        if (!otp || !userId) {
            return res.status(400).json({error: "Empty OTP Details Are Not Allowed"});
        } else {
            const CandidateOTPVerificationRecords =
                await CandidateOTPVerification.find({userId});
            if (CandidateOTPVerificationRecords.length <= 0) {
                return res.status(400).json({error: "Account Record Does Not Exists Or Has Been Verified Already. Please Sign In"});
            } else {
                const {expiresAt} = CandidateOTPVerificationRecords[0];
                const hashedOTP = CandidateOTPVerificationRecords[0].otp;
                if (expiresAt < Date.now()) {
                    await CandidateOTPVerification.deleteMany({userId});
                    return res.status(400).json({error: "Code Has Expired. Please Try Again"});
                } else {
                    const validOTP = bcrypt.compare(otp, hashedOTP);
                    if (!validOTP) {
                        return res.status(401).json({error: "Invalid OTP"});
                    } else {
                        await Candidate.updateOne({_id: userId}, {verified: true});
                        await CandidateOTPVerification.deleteMany({userId});
                        res.json({
                            status: "VERIFIED",
                            message: "Candidate Email Verified Successfully",
                        });
                    }
                }
            }
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            error: error.message,
        });
    }
});

router.post("/candidate/resendOTPVerificationCode", async (req, res) => {
    try {
        const {userId, email} = req.body;

        if (!userId || !email) {
            return res.status(400).json({error: "All Fields Are Required"});
        }

        await CandidateOTPVerification.deleteMany({userId});

        const otp = Math.floor(`${100000 + Math.random() * 900000}`).toString();
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        const expirationDuration = 60000;
        const expiresAt = Date.now() + expirationDuration;

        const newOTPVerification = await new CandidateOTPVerification({
            otp: hashedOTP,
            userId: userId,
            createdAt: Date.now(),
            expiresAt: expiresAt,
        }).save();

        const htmlEmail = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification Email</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #2c3e50;">OTP Verification</h2>
    </div>
    <div style="text-align: center; margin-bottom: 20px;">
      <p style="color: #34495e; font-size: 16px;">Hello,</p>
      <p style="color: #34495e; font-size: 16px;">Your OTP Verification Code Is:</p>
      <div style="background-color: #3498db; color: #ffffff; padding: 12px 24px; border-radius: 5px; display: inline-block; font-size: 24px; margin-top: 10px;">${otp}</div>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <p style="color: #34495e; font-size: 16px;">Please Use This Code To Verify Your Account. Note That This Code Will Expire In One Minute.</p>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #7f8c8d;">
      <p style="color: #7f8c8d;">Sent By CareerSync</p>
    </div>
  </div>
</body>
</html>
    `;

        const mailOptions = {
            from: process.env.AUTHENTICATION_EMAIL,
            to: email,
            subject: "Confirm Your Email Address With CareerSync",
            html: htmlEmail,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            status: "PENDING",
            message: "Verification OTP Sent Successfully",
            additionalInformation: {
                userId: userId,
                email: email,
            },
        });
    } catch (error) {
        return res.status(500).json({
            status: "FAILED",
            error: "Failed to send OTP verification email",
        });
    }
});

router.post("/employer/verifyOTP", async (req, res) => {
    try {
        let {otp, userId} = req.body;
        if (!otp || !userId) {
            throw Error("Empty OTP Details Are Not Allowed");
        } else {
            const EmployerOTPVerificationRecords = await EmployerOTPVerification.find(
                {userId}
            );
            if (EmployerOTPVerificationRecords.length <= 0) {
                throw new Error(
                    "Account Record Does Not Exists Or Has Been Verified Already. Please Sign In"
                );
            } else {
                const {expiresAt} = EmployerOTPVerificationRecords[0];
                const hashedOTP = EmployerOTPVerificationRecords[0].otp;
                if (expiresAt < Date.now()) {
                    await EmployerOTPVerification.deleteMany({userId});
                    throw new Error("Code Has Expired. Please Try Again");
                } else {
                    const validOTP = bcrypt.compare(otp, hashedOTP);
                    if (!validOTP) {
                        throw new Error("Invalid OTP");
                    } else {
                        await Employer.updateOne({_id: userId}, {verified: true});
                        await EmployerOTPVerification.deleteMany({userId});
                        res.json({
                            status: "VERIFIED",
                            message: "Employer Email Verified Successfully",
                        });
                    }
                }
            }
        }
    } catch (error) {
        res.json({
            status: "FAILED",
            message: error.message,
        });
    }
});

router.post("/employer/resendOTPVerificationCode", async (req, res) => {
    try {
        const {userId, email} = req.body;

        if (!userId || !email) {
            return res.status(400).json({error: "All Fields Are Required"});
        }

        await EmployerOTPVerification.deleteMany({userId});

        const otp = Math.floor(`${100000 + Math.random() * 900000}`).toString();
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        const expirationDuration = 60000;
        const expiresAt = Date.now() + expirationDuration;

        const newOTPVerification = await new EmployerOTPVerification({
            otp: hashedOTP,
            userId: userId,
            createdAt: Date.now(),
            expiresAt: expiresAt,
        }).save();

        const htmlEmail = `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification Email</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #2c3e50;">OTP Verification</h2>
    </div>
    <div style="text-align: center; margin-bottom: 20px;">
      <p style="color: #34495e; font-size: 16px;">Hello,</p>
      <p style="color: #34495e; font-size: 16px;">Your OTP Verification Code Is:</p>
      <div style="background-color: #3498db; color: #ffffff; padding: 12px 24px; border-radius: 5px; display: inline-block; font-size: 24px; margin-top: 10px;">${otp}</div>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <p style="color: #34495e; font-size: 16px;">Please Use This Code To Verify Your Account. Note That This Code Will Expire In One Minute.</p>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #7f8c8d;">
      <p style="color: #7f8c8d;">Sent By CareerSync</p>
    </div>
  </div>
</body>
</html>
    `;

        const mailOptions = {
            from: process.env.AUTHENTICATION_EMAIL,
            to: email,
            subject: "Confirm Your Email Address With CareerSync",
            html: htmlEmail,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            status: "PENDING",
            message: "Verification OTP Email Sent",
            additionalInformation: {
                userId: userId,
                email: email,
            },
        });
    } catch (error) {
        console.error("Error sending OTP verification email:", error);
        return res.status(500).json({
            status: "FAILED",
            message: "Failed to send OTP verification email",
        });
    }
});

router.post("/candidate/requestPasswordReset", (req, res) => {
    const {email, redirectUrl} = req.body;
    Candidate.find({email})
        .then((data) => {
            if (data.length) {
                if (!data[0].verified) {
                    res.json({
                        status: "FAILED",
                        error: "Email Hasn't Been Verified Yet",
                    });
                } else {
                    candidateSendResetEmail(data[0], redirectUrl, res);
                }
            }
        })
        .catch((error) => {
            res.status(404).json({
                status: "FAILED",
                error: "No Account With The Supplied Email Exists!",
            });
        });
});

router.post("/candidate/resetPassword", (req, res) => {
    let {userId, resetString, newPassword} = req.body;
    CandidatePasswordReset.findOne({userId})
        .then((result) => {
            if (result) {
                const {expiresAt, resetString: hashedResetString} = result;
                if (expiresAt < Date.now()) {
                    CandidatePasswordReset.deleteOne({userId})
                        .then(() => {
                            res.json({
                                status: "FAILED",
                                error: "Password Reset Link Has Expired!",
                            });
                        })
                        .catch((error) => {
                            res.json({
                                status: "FAILED",
                                message: "Clearing Existing Password Reset Records Failed!",
                            });
                        });
                } else {
                    bcrypt
                        .compare(resetString, hashedResetString)
                        .then((passwordsMatch) => {
                            if (passwordsMatch) {
                                const saltRounds = 10;
                                bcrypt
                                    .hash(newPassword, saltRounds)
                                    .then((hashedNewPassword) => {
                                        Candidate.updateOne(
                                            {_id: userId},
                                            {password: hashedNewPassword}
                                        )
                                            .then(() => {
                                                CandidatePasswordReset.deleteOne({userId})
                                                    .then(() => {
                                                        res.json({
                                                            status: "SUCCESS",
                                                            message: "Password has been Reset Successfully",
                                                        });
                                                    })
                                                    .catch((error) => {
                                                        res.json({
                                                            status: "FAILED",
                                                            message: "An Error Occurred While Password Reset",
                                                        });
                                                    });
                                            })
                                            .catch((error) => {
                                                res.json({
                                                    status: "FAILED",
                                                    message: "Updating Password Reset Failed!",
                                                });
                                            });
                                    })
                                    .catch((error) => {
                                        res.json({
                                            status: "FAILED",
                                            message: "An Error Occurred While Hashing New Password",
                                        });
                                    });
                            } else {
                                res.json({
                                    status: "FAILED",
                                    error: "Invalid Password Reset Details Passed!",
                                });
                            }
                        })
                        .catch((error) => {
                            res.json({
                                status: "FAILED",
                                message: "Comparing Password Reset Strings Failed!",
                            });
                        });
                }
            } else {
                res.json({
                    status: "FAILED",
                    error: "Password Reset Request Not Found!",
                });
            }
        })
        .catch((error) => {
            res.json({
                status: "FAILED",
                message: "Checking For Existing Password Reset Records Failed!",
            });
        });
});

router.post("/employer/requestPasswordReset", (req, res) => {
    const {email, redirectUrl} = req.body;
    Employer.find({email})
        .then((data) => {
            if (data.length) {
                if (!data[0].verified) {
                    res.json({
                        status: "FAILED",
                        error: "Email Hasn't Been Verified Yet. Check Your Inbox",
                    });
                } else {
                    employerSendResetEmail(data[0], redirectUrl, res);
                }
            }
        })
        .catch((error) => {
            res.json({
                status: "FAILED",
                error: "No Account With The Supplied Email Exists!",
            });
        });
});

router.post("/employer/resetPassword", (req, res) => {
    let {userId, resetString, newPassword} = req.body;
    EmployerPasswordReset.findOne({userId})
        .then((result) => {
            if (result) {
                const {expiresAt, resetString: hashedResetString} = result;
                if (expiresAt < Date.now()) {
                    EmployerPasswordReset.deleteOne({userId})
                        .then(() => {
                            res.json({
                                status: "FAILED",
                                error: "Password Reset Link Has Expired!",
                            });
                        })
                        .catch((error) => {
                            res.json({
                                status: "FAILED",
                                message: "Clearing Existing Password Reset Records Failed!",
                            });
                        });
                } else {
                    bcrypt
                        .compare(resetString, hashedResetString)
                        .then((passwordsMatch) => {
                            if (passwordsMatch) {
                                const saltRounds = 10;
                                bcrypt
                                    .hash(newPassword, saltRounds)
                                    .then((hashedNewPassword) => {
                                        Employer.updateOne(
                                            {_id: userId},
                                            {password: hashedNewPassword}
                                        )
                                            .then(() => {
                                                EmployerPasswordReset.deleteOne({userId})
                                                    .then(() => {
                                                        res.json({
                                                            status: "SUCCESS",
                                                            message: "Password has been Reset Successfully",
                                                        });
                                                    })
                                                    .catch((error) => {
                                                        res.json({
                                                            status: "FAILED",
                                                            message: "An Error Occurred While Password Reset",
                                                        });
                                                    });
                                            })
                                            .catch((error) => {
                                                res.json({
                                                    status: "FAILED",
                                                    message: "Updating Password Reset Failed!",
                                                });
                                            });
                                    })
                                    .catch((error) => {
                                        res.json({
                                            status: "FAILED",
                                            message: "An Error Occurred While Hashing New Password",
                                        });
                                    });
                            } else {
                                res.json({
                                    status: "FAILED",
                                    error: "Invalid Password Reset Details Passed!",
                                });
                            }
                        })
                        .catch((error) => {
                            res.json({
                                status: "FAILED",
                                message: "Comparing Password Reset Strings Failed!",
                            });
                        });
                }
            } else {
                res.json({
                    status: "FAILED",
                    error: "Password Reset Request Not Found!",
                });
            }
        })
        .catch((error) => {
            res.json({
                status: "FAILED",
                message: "Checking For Existing Password Reset Records Failed!",
            });
        });
});

const candidateSendResetEmail = ({_id, email}, redirectUrl, res) => {
    const resetString = uuidv4() + _id;
    CandidatePasswordReset.deleteMany({userId: _id})
        .then((result) => {
            const htmlEmail = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Email</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #2c3e50;">Password Reset</h2>
    </div>
    <div style="text-align: center; margin-bottom: 20px;">
      <p style="color: #34495e; font-size: 16px;">Hello,</p>
      <p style="color: #34495e; font-size: 16px;">Please Click The Button Below To Reset Your Password. This Link Will Expire In One Minute.</p>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <a href="${redirectUrl}?userId=${_id}&uuid=${resetString}" style="background-color: #3498db; color: #ffffff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-size: 16px; text-transform: uppercase;">Reset Your Password</a>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #7f8c8d;">
      <p style="color: #7f8c8d;">Sent By CareerSync</p>
    </div>
  </div>
</body>
</html>          
`;
            const mailOptions = {
                from: process.env.AUTHENTICATION_EMAIL,
                to: email,
                subject: "Password Reset Request For Your CareerSync Account",
                html: htmlEmail,
            };

            const saltRounds = 10;
            bcrypt
                .hash(resetString, saltRounds)
                .then((hashedResetString) => {
                    const newPasswordReset = new CandidatePasswordReset({
                        userId: _id,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 90000,
                        resetString: hashedResetString,
                    });
                    newPasswordReset
                        .save()
                        .then(() => {
                            transporter
                                .sendMail(mailOptions)
                                .then(() => {
                                    return res.json({
                                        status: "PENDING",
                                        message: "Password Reset Email Sent. Check Your Inbox!",
                                        id: _id,
                                        email,
                                    });
                                })
                                .catch((error) => {
                                    return res.json({
                                        status: "FAILED",
                                        error: "Password Reset Email Failed",
                                    });
                                });
                        })
                        .catch((error) => {
                            return res.json({
                                status: "FAILED",
                                error: "Could Not Save Password Reset Data!",
                            });
                        });
                })
                .catch((error) => {
                    return res.json({
                        status: "FAILED",
                        error: "An Error Occurred While Hashing The Password Reset Data!",
                    });
                });
        })
        .catch((error) => {
            return res.json({
                status: "FAILED",
                message: "Clearing Existing Password Reset Records Failed!",
            });
        });
};

const employerSendResetEmail = ({_id, email}, redirectUrl, res) => {
    const resetString = uuidv4() + _id;
    EmployerPasswordReset.deleteMany({userId: _id})
        .then((result) => {
            const htmlEmail = `
      <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Email</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 20px;">
      <h2 style="color: #2c3e50;">Password Reset</h2>
    </div>
    <div style="text-align: center; margin-bottom: 20px;">
      <p style="color: #34495e; font-size: 16px;">Hello,</p>
      <p style="color: #34495e; font-size: 16px;">Please Click The Button Below To Reset Your Password. This Link Will Expire In One Minute.</p>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <a href="${redirectUrl}?userId=${_id}&uuid=${resetString}" style="background-color: #3498db; color: #ffffff; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-size: 16px; text-transform: uppercase;">Reset Your Password</a>
    </div>
    <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #7f8c8d;">
      <p style="color: #7f8c8d;">Sent By CareerSync</p>
    </div>
  </div>
</body>
</html>    
`;
            const mailOptions = {
                from: process.env.AUTHENTICATION_EMAIL,
                to: email,
                subject: "Password Reset Request for Your CareerSync Account",
                html: htmlEmail,
            };

            const saltRounds = 10;
            bcrypt
                .hash(resetString, saltRounds)
                .then((hashedResetString) => {
                    const newPasswordReset = new EmployerPasswordReset({
                        userId: _id,
                        createdAt: Date.now(),
                        expiresAt: Date.now() + 60000,
                        resetString: hashedResetString,
                    });
                    newPasswordReset
                        .save()
                        .then(() => {
                            transporter
                                .sendMail(mailOptions)
                                .then(() => {
                                    res.json({
                                        status: "PENDING",
                                        message: "Password Reset Email Sent",
                                        id: _id,
                                        email,
                                    });
                                })
                                .catch((error) => {
                                    res.json({
                                        status: "FAILED",
                                        message: "Password Reset Email Failed",
                                    });
                                });
                        })
                        .catch((error) => {
                            res.json({
                                status: "FAILED",
                                message: "Could Not Save Password Reset Data!",
                            });
                        });
                })
                .catch((error) => {
                    res.json({
                        status: "FAILED",
                        message: "An Error Occurred While Hashing The Password Reset Data!",
                    });
                });
        })
        .catch((error) => {
            res.json({
                status: "FAILED",
                message: "Clearing Existing Password Reset Records Failed!",
            });
        });
};

module.exports = router;