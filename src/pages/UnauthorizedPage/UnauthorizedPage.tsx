const UnauthorizedPage = () => {
  return (
    <main className="absolute top-0 bottom-0 left-0 right-0 text-2xl max-md:text-xl -z-10">
      <p className="h-full flex justify-center items-center text-center px-4">
        Чтобы получить доступ к этой странице, Вам нужно авторизоваться!
      </p>
    </main>
  );
};

export default UnauthorizedPage;
