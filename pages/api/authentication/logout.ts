const logout = () => {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('account_no');
        localStorage.removeItem('id');
        return {
            status : true,
            message: 'Success',
        };
    } catch (error) {
        return {
            status: false,
            message: 'something unexpectd happened',
            data: error
        }
    }
};

export default logout;