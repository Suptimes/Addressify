
const Unauthorized = () => {
    return (
        <div className="flex items-center justify-center mt-[-20px] h-[calc(100vh-100px)]">
            <div className="text-center">
                <h1 className="text-4xl font-bold">Unauthorized</h1>
                <p className="mt-4">You do not have permission to view this page.</p>
            </div>
        </div>
    );
};

export default Unauthorized;