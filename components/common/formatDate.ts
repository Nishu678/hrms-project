const formatDate = (date: string) => {
    if (!date || date === "-") return "-";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "-";
    return parsedDate.toLocaleDateString("en-US");
};

export default formatDate;