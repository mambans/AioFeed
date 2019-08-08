const Utilities = {
    truncate: function(input, max) {
        if (input.length > max) return input.substring(0, max) + "..";
        else return input;
    },
};

export default Utilities;
