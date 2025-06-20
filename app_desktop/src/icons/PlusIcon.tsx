
export default function PlusIcon(props: {
    w: string;
    h: string;
}) {
    const { w, h } = props;

    return (
        <svg className={`${w} ${h}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );
};
