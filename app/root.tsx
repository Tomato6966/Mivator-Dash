

import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import stylesheet from "~/tailwind.css";

import { json } from "@remix-run/node";
import { Links, Meta, Outlet, Scripts, useLoaderData, useSearchParams } from "@remix-run/react";
import { LinksFunction, LoaderArgs } from "@remix-run/server-runtime";

import { ToastMessageTypes } from "../utils/ToastMessages";
import { requestGuild, requestMachine } from "./init.server";

// https://icons8.com/icon/set/warn/fluency
const ToastStyles = {
  success: "https://img.icons8.com/fluency/48/check-all.png",
  warn: "https://img.icons8.com/fluency/48/error.png",
  info: "https://img.icons8.com/fluency/48/info.png",
  error: "https://img.icons8.com/fluency/48/close-window.png",
}

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url);
  const Toast = {
    type: url.searchParams.get('tmsg') as ToastMessageTypes || null,
    title: url.searchParams.get('ttext') as string,
    content: url.searchParams.get('tcontent') as string,
  };
  url.searchParams.delete("tmsg", url.searchParams.get("tmsg"));
  url.searchParams.delete("ttext", url.searchParams.get("ttext"));
  url.searchParams.delete("tcontent", url.searchParams.get("tcontent"));
  const res = await requestMachine<number>(c => c.ws.ping);
  const guildData = await requestGuild<{id:string,name:string,memberCount:number,icon:string,channelCount:number,roleCount:number}>("1070626568260562954", c => {
    const guild = c.guilds.cache.get("1070626568260562954");
    if(!guild) return null;
    return {
      id: guild.id,
      name: guild.name,
      memberCount: guild.memberCount,
      icon: guild.icon,
      channelCount: guild.channels.cache.size,
      roleCount: guild.roles.cache.size
    }
  })
  return json({ Toast, res, guildData });
}


export default function App() {
  const { Toast, res, guildData } = useLoaderData<typeof loader>();
  
  // If Toast Available
  if(Toast.type) {
    const [searchParams, setSearchParams] = useSearchParams();
    searchParams.delete("tmsg", searchParams.get("tmsg"));
    searchParams.delete("ttext", searchParams.get("ttext"));
    searchParams.delete("tcontent", searchParams.get("tcontent"));
    setSearchParams(searchParams);
    
    // apply the toast effect
    useEffect(() => {
      if (!Toast.type) {
        return;
      }
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <img
                  className="h-10 w-10 rounded-full"
                  src={ToastStyles[Toast.type]!}
                  alt="🧑‍💻"
                />
              </div>
              <div className="ml-3 flex-1">
                <p className={
                  Toast.type == "success" 
                  ? "text-sm font-medium text-[#5dd998]" 
                  : Toast.type == "warn"
                  ? "text-sm font-medium text-[#feb806]" 
                  : Toast.type == "info"
                  ? "text-sm font-medium text-[#1494df]" 
                  : Toast.type == "error"
                  ? "text-sm font-medium text-[#ec3644]" 
                  : "text-sm font-medium text-white" 
                  }>{Toast.title}</p>
                  {Toast.content ? <p className="mt-1 text-sm text-gray-500">{Toast.content}</p>:<></>}
              </div>
            </div>
          </div>
          <div className="flex border-l border-gray-200">
            <button
              onClick={() => toast.dismiss(t.id)}
              className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      ), { id: `Toast_Custom${Date.now()}`});
    }, [Toast]);
  }

  
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>Hello world!</h1>
        <p> Current ping: {res[0]} </p>
        <p> DevGuild: {guildData.memberCount} Members on {guildData.channelCount} Channels on {guildData.roleCount} Roles in {guildData.name} </p>
        <Outlet />

        <Toaster position="bottom-right" reverseOrder={true} toastOptions={{
          duration: 10000
        }}/>


        <Scripts />
      </body>
    </html>
  );
}