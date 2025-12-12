export default function ChatFooter({ input, setInput, sendMessage }) {
return (
<div className="flex items-center space-x-2">
<input
value={input}
onChange={(e) => setInput(e.target.value)}
onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
className="flex-1 p-3 rounded-xl bg-white dark:bg-neutral-700 dark:text-white border"
placeholder="Message..."
/>


<button
onClick={sendMessage}
className="px-4 py-2 bg-blue-600 text-white rounded-xl"
>
Send
</button>
</div>
);
}