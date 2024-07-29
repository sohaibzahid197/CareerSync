import React from 'react';

function FullPageLoader() {
    return (
        <div className={`flex bg-slate-950 justify-center items-center w-auto h-screen`}>
            <div className="relative inline-flex">
                <div className="w-8 h-8 bg-slate-50 rounded-full"></div>
                <div className="w-8 h-8 bg-slate-50 rounded-full absolute top-0 left-0 animate-ping"></div>
                <div className="w-8 h-8 bg-slate-50 rounded-full absolute top-0 left-0 animate-pulse"></div>
            </div>
        </div>
    );
}

export default FullPageLoader;