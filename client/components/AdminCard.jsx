const AdminCard = ({description, Icon, dataval, unit}) => {
    return (
        <div className="stat bg-primary text-primary-content">
            <div className="stat-figure">
                <Icon className="text-xl md:text-3xl" />
            </div>
            <div className="stat-title text-sm md:text-lg">{description}</div>
            <div className="stat-value">{dataval}</div>
            <div className="stat-desc">{unit}</div>
        </div>
    );
};

export default AdminCard;
