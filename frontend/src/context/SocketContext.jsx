import { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";



// Create a context for sharing socket instance
const SocketContext = createContext();

// Custom hook to access socket context
export const useSocket = () => {
    return useContext(SocketContext);
};

// Provider component to manage socket connection
export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    
    const user = useRecoilValue(userAtom);

    // Effect to initialize and manage socket connection
    useEffect(() => {
        // Connect to Socket.IO server with user ID in query
        const socket = io("/", {
			query: {
				userId: user?._id,
			},
		});
        // Store socket instance in state
        setSocket(socket);



        /* Online Users */
        // Listen for "getOnlineUsers" event from the server and update state
        socket.on("getOnlineUsers", (users) => {
            setOnlineUsers(users);
        });
        



        // Cleanup: Disconnect socket when component unmounts
        return () => socket && socket.close();
    }, [user?._id]); // Re-run effect if user ID changes

  //  console.log("onlineUsers", onlineUsers);

    // Provide socket instance to children components
    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};