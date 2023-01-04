import React, { useState } from "react";
import CommonLayout from "../components/CommonLayout";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import OtpInput from 'react-otp-input';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState(false);
    const [otpPage, setOtpPage] = useState(false);
    const [changePassPage, setChangePassPage] = useState(false);
    const [passChanged, setPassChanged] = useState(false);
    const [newPass, setNewPass] = useState("");
    const [newPassConfirm, setNewPassConfirm] = useState("");

    const handleMobileInput = (val) => {
        if (/^[0-9]*$/.test(val) && val.length <= 10)
            setMobile(val)
    }

    const sendOtp = () => {
        if (mobile.length != 10) {
            setError(true);
            setTimeout(() => setError(false), 3000)
            return;
        }
        setOtpPage(true);
    }

    const verifyOtp = () => {
        // setError(true);
        // setTimeout(() => setError(false), 3000)
        // return;
        setChangePassPage(true)
    }

    const changePassword = () => {
        if (!newPass) {
            setError({ err1: "This field is required" });
            setTimeout(() => setError(false), 3000)
            return;
        }
        if (!newPassConfirm) {
            setError({ err2: "This field is required" });
            setTimeout(() => setError(false), 3000)
            return;
        }
        if (newPass.length < 3) {
            setError({ err1: "Password must be atleast of 3 characters" });
            setTimeout(() => setError(false), 3000)
            return;
        }
        if (newPassConfirm.length < 3) {
            setError({ err2: "Password must be atleast of 3 characters" });
            setTimeout(() => setError(false), 3000)
            return;
        }
        if (newPass != newPassConfirm) {
            setError({ err: "Passwords do not match" });
            setTimeout(() => setError(false), 3000)
            return;
        }
        setPassChanged(true);
    }

    return (
        <CommonLayout back={'/'}>
            {!otpPage && !changePassPage && !passChanged && <div className="flex flex-col px-10 py-8 h-100 justify-between h-[90%]">
                <div className="w-full">
                    <p className="text-secondary text-2xl font-semibold">Enter your registered mobile number</p>
                    <input className={`${error && 'border-red-400 animate__animated animate__headShake'} border-2 rounded px-3 py-4 text-xl mt-10 w-full`} value={mobile} onChange={(e) => handleMobileInput(e.target.value)} />
                    {error && <p className="text-red-500 text-sm font-semibold py-1">Please enter a valid mobile number</p>}
                </div>
                <Button text='Send OTP' onClick={sendOtp} />
            </div >}
            {otpPage && !changePassPage && !passChanged && <div className="flex flex-col px-10 py-8 h-100 justify-between h-[90%]">
                <div className="w-full">
                    <p className="text-secondary text-xl lg:text-2xl font-semibold">Enter OTP sent on </p>
                    <p className="text-primary text-2xl lg:text-3xl font-semibold py-4">{mobile || '9654591151'}</p>
                    <style>
                        {`
                            .error-otp {
                                border: 1.5px solid red !important;
                            }
                        `}
                    </style>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={4}
                        containerStyle={"w-full py-6"}
                        inputStyle={{
                            border: '1px solid #9b9b9b',
                            borderRadius: '0.25rem',
                            marginRight: '1rem',
                            height: '4rem',
                            width: '3rem',
                            fontSize: '1.5rem',
                            color: 'rgba(0,0,0,0.5)'
                        }}
                        isInputNum
                        hasErrored={error}
                        errorStyle={"animate__animated animate__headShake error-otp"}
                        shouldAutoFocus={true}
                    />
                    {error && <p className="text-red-500 text-sm font-semibold py-1">Wrong OTP entered </p>}
                </div>
                <Button text='Verify OTP' onClick={verifyOtp} />
            </div >}
            {changePassPage && !passChanged && <div className="flex flex-col px-10 py-8 h-100 justify-between h-[90%]">
                <div className="w-full">
                    <p className="text-secondary text-xl font-semibold">Change Password Here</p>
                    <input className={`border ${(error?.err1 || error?.err) && 'border-2 border-red-400 animate__animated animate__headShake'} border-primary rounded px-3 py-3 text-lg mt-10 w-full`} placeholder="New Password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
                    {(error?.err1 || error?.err) && <p className="text-red-500 text-sm font-semibold py-1">{error?.err1 || error?.err}</p>}
                    <input className={`border ${(error?.err2 || error?.err) && 'border-2 border-red-400 animate__animated animate__headShake'} border-primary rounded px-3 py-3 text-lg mt-10 w-full`} placeholder="Confirm New Password" value={newPassConfirm} onChange={(e) => setNewPassConfirm(e.target.value)} />
                    {(error?.err2 || error?.err) && <p className="text-red-500 text-sm font-semibold py-1">{error?.err2 || error?.err}</p>}
                </div>
                <Button text='Save' onClick={changePassword} />
            </div >}
            {passChanged && <div className="flex flex-col px-10 py-8 h-100 justify-between h-[90%]">
                <div className="w-full">
                    <p className="text-secondary text-xl font-semibold">Your password has been changed successfully</p>
                    <p className="text-primary text-xl py-8 font-semibold" onClick={() => navigate("/")}>Click here to login</p>
                </div>
                <Button text='Save' onClick={changePassword} />
            </div >}
        </CommonLayout >
    );
};

export default ForgotPassword;