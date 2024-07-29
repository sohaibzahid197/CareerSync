import Image from "next/image";
import Link from "next/link";

import {Badge} from "@/components/ui/badge";

const JobBadge = ({
                      data,
                      badgeStyles,
                      isLocation,
                      isCandidate,
                      className,
                  }) => {
    if (isLocation && !data.location) return null;

    const classNames = isLocation
        ? "`gap-2 rounded-full border-none bg-slate-200 text-slate-950 font-bold px-4 py-2"
        : `bg-transparent relative ${className} shadow-xl ${isCandidate ? 'rounded-full' : 'rounded-lg'} border border-slate-950`;
    const variant = isLocation ? "default" : "outline";
    return (
        <Badge variant={variant} className={`${classNames} ${badgeStyles}`}>
            {isLocation ? (
                <div className={'flex gap-1'}>
                    {data.location}
                    {data.country && (
                        <>
                            <Image
                                src={`https://flagsapi.com/${data.country}/flat/64.png`}
                                width={16}
                                height={16}
                                alt="flag"
                                className="rounded-full"
                            />
                        </>

                    )}
                </div>
            ) : (
                <Image
                    src={data.logo}
                    fill
                    alt="logo"
                    className={`object-contain p-2 ${isCandidate ? 'rounded-full' : 'rounded-lg'}`}
                />
            )}
        </Badge>
    );
};

export default JobBadge;