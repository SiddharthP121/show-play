import React from "react";
import { GoHeart } from "react-icons/go";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiEdit2 } from "react-icons/fi";

const AccountThoughts = ({ thoughts }) => {
  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.isArray(thoughts) && thoughts.map((thought) => (
        <div key={thought._id} className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-2xl transition-shadow duration-300 flex flex-col justify-between">
          <div>
            <p className="text-gray-800 text-base mb-3">{thought.content}</p>
            <p className="text-sm text-gray-400">By {thought.owner.username}</p>
            <p className="text-xs text-gray-400">
              {new Date().toLocaleString()}
            </p>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors cursor-pointer">
              <GoHeart className="text-xl" />
              <span>{thought.likes
                }</span>
            </div>

            <div className="flex gap-4 text-gray-500">
              <FiEdit2 className="text-lg hover:text-blue-600 cursor-pointer transition-colors" />
              <RiDeleteBin6Line className="text-lg hover:text-red-600 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccountThoughts;
