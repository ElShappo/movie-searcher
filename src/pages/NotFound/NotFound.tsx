const NotFound = () => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 text-2xl max-md:text-xl -z-10">
      <div className="h-full flex justify-center items-center text-center px-4">
        <p className="rounded-xl bg-blue-800 p-5">404 (page not found)</p>
      </div>
    </div>
  );
};

export default NotFound;
