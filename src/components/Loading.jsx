const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black mb-4"></div>
        <p className="text-black text-lg">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
