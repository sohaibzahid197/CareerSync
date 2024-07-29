import Link from "next/link";
import Image from "next/image";

const Metric = ({
                    imgUrl, alt, value, title, href, textStyles, isAuthor,className
                }) => {
    const metricContent = (<>
            <Image
                src={imgUrl}
                alt={alt}
                width={16}
                height={16}
                className={`object-contain ${href && "rounded-full"}`}
            />
            <p className={`${textStyles} flex items-center gap-1 font-bold text-xs`}>
                {value}
                {title && (<span
                        className={`small-regular line-clamp-1 ${isAuthor && "max-sm:hidden"}`}
                    >
            {title}
          </span>)}
            </p>
        </>);

    if (href) {
        return (<Link href={href} className="flex-center gap-1">
                {metricContent}
            </Link>);
    }

    return <div className={`${className} flex justify-center bg-slate-950 text-slate-50 px-4 py-2 rounded-full items-center flex-wrap gap-1`}>{metricContent}</div>;
};

export default Metric;