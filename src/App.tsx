import { Editor } from "./Editor";

function App() {
  return (
    <div className="flex items-center min-h-screen  bg-gradient-to-r from-[#90b823] to-[#007535]">
      <div className="bg-white  w-[1100px] mx-auto rounded-xl min-h-[600px] shadow-sm border border-black/20 overflow-hidden grid grid-cols-[16rem_1fr]">
        <main className="p-4">
          <Editor />
        </main>
      </div>
    </div>
  );
}

export default App;
