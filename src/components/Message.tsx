import { supabase } from "@/config/supabase";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";

interface Message {
    id: number;
    conversation_id: number;
    sender_id: number;
    content: string;
    image_url?: Array<string>;
    created_at: string;
}

export const Message = () => {
    const [data, setData] = useState<Message[]>([]);
    const [textContent, setTextContent] = useState("");
    const [selectedFile, setSelectedFile] = useState<File[] | null>(null);
    const [uploading, setUploading] = useState(false);


    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();



        try {



        } catch (error: any) {
            toast.error(error.message || "Failed to send message");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files);
            setSelectedFile(filesArray);
        }
    };

    const uploadImages = async (): Promise<string[]> => {
        const uploadPromises = selectedFile.map(async (file) => {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `message-images/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("images")
                .upload(filePath, file);

            if (uploadError) {
                console.error(`Error uploading ${file.name}:`, uploadError.message);
                throw uploadError;
            }

            const { data: urlData } = supabase.storage
                .from("images")
                .getPublicUrl(filePath);

            return urlData.publicUrl;
        });

        //  Wait for all uploads to complete simultaneously
        return await Promise.all(uploadPromises);
    };



    const insertConversationMember = async (convId: number) => {
        const { data } = await supabase.from("conversation_members").insert([
            { conversation_id: convId, user_id: "16c9fb1e-a6e2-4453-8ef9-c2040e2d3bb5" },
            { conversation_id: convId, user_id: "467afdd1-fb81-49d0-b625-3e83336b56e6" },
        ]);
        console.log(data);
    }


    const sendMessage = async (convId: number) => {

        if (!textContent.trim() && !selectedFile) {
            toast.error("Please enter a message or select an image");
            return;
        }
        setUploading(true);

        try {

            let uploadedImageUrls = null;
            if (selectedFile) {
                uploadedImageUrls = await uploadImages();
            }



            const { data } = await supabase.from("messages").insert([{
                conversation_id: convId,
                sender_id: "16c9fb1e-a6e2-4453-8ef9-c2040e2d3bb5",
                content: textContent,
                image_url: uploadedImageUrls
            }]).select();
            console.log(data);


            toast.success("Message sent!");
            setTextContent("");
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";


        } catch (error) {
            toast.error(error.message || "Failed to send message");
        } finally {
            setUploading(false);
        }
    }

    type ConversationMember = {
        conversation_id: number;
        user_id: string;
    };

    const getOrCreateConversationId = async (
        currentUserId: string,
        otherUserId: string
    ) => {
        //  Find all conversations containing either user
        const { data, error } = await supabase
            .from("conversation_members")
            .select("conversation_id, user_id")
            .in("user_id", [currentUserId, otherUserId])
            .returns<ConversationMember[]>();

        if (error) {
            console.log(error);
            return null;
        }

        // Group users by conversation_id
        const grouped: Record<string, string[]> = {};

        (data || []).forEach((row) => {
            const convId = row.conversation_id.toString();

            if (!grouped[convId]) {
                grouped[convId] = [];
            }

            grouped[convId].push(row.user_id);
        });

        //  Check if both users already exist in same conversation
        const existingConversation = Object.entries(grouped).find(
            ([_, users]) =>
                users.includes(currentUserId) &&
                users.includes(otherUserId) &&
                users.length === 2
        );

        //  If exists → return existing conversation id
        if (existingConversation) {
            console.log("getorcreate",existingConversation[0]);
            return Number(existingConversation[0]);
        }

        //  Create new conversation
        const { data: newConversation, error: conversationError } =
            await supabase
                .from("conversations")
                .insert({
                    is_group: false,
                })
                .select()
                .single();

        if (conversationError) {
            console.log(conversationError);
            return null;
        }

        await insertConversationMember(newConversation.id);

        
        return newConversation.id;
    };



    const send = async (currentUserId: string, otherUserId: string) => {

        try {
            const convId = await getOrCreateConversationId(currentUserId, otherUserId);
            await sendMessage(convId);
        } catch (error) {
            toast.error(error.message);
        }
    }


    useEffect(() => {
        const channel = supabase
            .channel("public:messages")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "messages",
                },
                (payload) => {
                    toast.info("New message received");

                    if (payload.eventType === "INSERT") {
                        setData((prev) => [...prev, payload.new as Message]);
                    }
                }
            )
            .subscribe();

        const handleFetch = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .order("id", { ascending: true });

            if (error) {
                toast.error(error.message);
            } else {
                setData(data as Message[]);
            }
        };

        handleFetch();



        return () => {
            supabase.removeChannel(channel);
        };
    }, []);



    return (
        <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
            {/* Messages Display */}
            <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "auto", padding: "10px", marginBottom: "20px" }}>
                {data.map((message) => (
                    <div key={message.id} style={{ marginBottom: "15px", borderBottom: "1px dashed #eee", paddingBottom: "10px" }}>
                        {message.content && <p style={{ margin: "0 0 5px 0" }}>{message.content}</p>}
                        {message.image_url && message.image_url.length > 0 && (
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
                                {message.image_url.map((url, index) => (
                                    <img
                                        key={index}
                                        src={url}
                                        alt={`Uploaded content ${index + 1}`}
                                        style={{
                                            maxWidth: "200px",
                                            maxHeight: "200px",
                                            borderRadius: "8px",
                                            display: "block",
                                            objectFit: "cover" // Keeps images looking consistent
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                    style={{ padding: "8px" }}
                />

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    multiple
                    onChange={handleFileChange}
                />

                {/* Local Image Preview */}
                {selectedFile && (
                    <div>
                        <p style={{ fontSize: "12px", margin: "0" }}>Preview:</p>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {selectedFile.map((file, index) => (
                                <div key={index} style={{ position: "relative" }}>
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`Preview ${index}`}
                                        style={{
                                            maxWidth: "100px",
                                            maxHeight: "100px",
                                            borderRadius: "4px",
                                            objectFit: "cover"
                                        }}
                                    />
                                    <button
                                        onClick={() => setSelectedFile(prev => prev.filter((_, i) => i !== index))}
                                        style={{ position: "absolute", top: 0, right: 0 }}
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <button type="submit" disabled={uploading}>
                    {uploading ? "Sending..." : "Send Message"}
                </button>

                <button onClick={() => send("16c9fb1e-a6e2-4453-8ef9-c2040e2d3bb5", "467afdd1-fb81-49d0-b625-3e83336b56e6")}>
                    sendMessage
                </button>
            </form>
        </div>
    );
};