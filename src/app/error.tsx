'use client';

import React from "react";
import ErrorComponent from "@/components/error";

const ErrorPage: React.FC = () => {
    return (
       <ErrorComponent message="Error in loading this page"/>
    );
};

export default ErrorPage;
