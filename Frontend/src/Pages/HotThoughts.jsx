import React, { useState, useEffect } from "react";
import { MdForum } from "react-icons/md";

const HotThoughts = () => {
  useEffect(() => {}, []);

//   const [thoughts, setThoughts] = useState([]);
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("")

  

  const handleSubmit = async (e) => {
    console.log("button clicked")
    e.preventDefault();
    try {
        const res = await axios.post("http://localhost:8000/api/v1/hot-thoughts/say", {content})
        // setMessage(res.data.message || "Thought published")
        console.log("second clicked")
        console.log(message)

    } catch (error) {
        setMessage(error.response?.data?.message || "Unable to publish thought")
        console.log(message)
    }
  };

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed top-0 right-0 w-80 h-screen bg-white shadow-lg p-4 z-40 pt-20">
        <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
          <MdForum size={22} /> Hot Thoughts
        </h2>
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="border-b pb-2 mb-2">
            <span className="font-semibold text-purple-600">demo user</span>
            <span className="ml-2 text-gray-700">demo thought</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="items-center ml-2">
          <div className="flex relative w-full md:w-72">
            <input
              type="text"
              placeholder="What's in your mind"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border font-bold text-gray-800 rounded-3xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition placeholder:font-bold placeholder:text-gray-500 pl-4"
            />
            <button
              className="mx-3 bg-purple-600 hover:bg-purple-700 text-white font-medium  py-2 px-4 rounded-3xl shadow-md transition duration-300"
              type="submit"
            >
              Publish
            </button>
          </div>
        </form>
      </aside>
    </>
  );
};

export default HotThoughts;
