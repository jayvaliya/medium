import { useEffect, useRef, useState } from "react";
import EditorJS, { OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Paragraph from "@editorjs/paragraph";
import { TfiThought } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { userAtom } from "../store/user";

const Editor = () => {
    const editorRef = useRef<EditorJS | null>(null);
    const holderRef = useRef<HTMLDivElement | null>(null);
    const [title, setTitle] = useState<string>("");
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        if (!holderRef.current || editorRef.current) return;

        const editor = new EditorJS({
            holder: holderRef.current,
            tools: {
                header: Header,
                paragraph: Paragraph,
                list: List,
            },
            autofocus: true,
            placeholder: "Start writing...",
            // onReady: () => {
            //     console.log('Editor.js is ready to work!');
            // },

            // onChange: async () => {
            //     try {
            //         const editorData = await editorRef.current.save();
            //         setData(editorData);
            //     } catch (error) {
            //         console.log('Saving failed: ', error);
            //     }
            // },
        });

        editorRef.current = editor;

        // Cleanup function
        return () => {
            if (editorRef.current) {
                editorRef.current.destroy();
                editorRef.current = null;
            }
        };
    }, [user, navigate]);

    const handleSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!editorRef.current) {
            console.warn("No editor instance found");
            return;
        }

        try {
            const savedData: OutputData = await editorRef.current.save();

            if (savedData.blocks.length === 0) {
                alert("Please write something before saving.");
                return;
            }

            const url = "http://localhost:8787/api/v1/blog";
            const content = JSON.stringify(savedData);
            const token = localStorage.getItem("token");

            const { data } = await axios.post(
                url,
                { title, content },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (data.error) {
                console.error("Failed to save editor data:", data.error);
                return;
            }

            if (data.blog) {
                navigate("/");
            }
        } catch (error) {
            console.error("Failed to save editor data:", error);
        }
    };

    return (
        <div className="w-full max-w-4xl pt-8 mx-auto">
            <h1 className="text-2xl text-center font-semibold mb-4">
                Free Your Thoughts. <TfiThought className="inline-block" />
            </h1>
            <div className="mb-4 flex items-center justify-between">
                <label htmlFor="title" className="block mb-2 mr-3 text-xl font-medium text-gray-900">
                    Title:
                </label>
                <input
                    type="text"
                    id="title"
                    className="border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title of the Article"
                />
            </div>
            <div ref={holderRef} className="border border-zinc-400 p-4 rounded-lg min-h-[200px]" />
            <button
                onClick={handleSave}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
                Save Content
            </button>
        </div>
    );
};

export default Editor;
