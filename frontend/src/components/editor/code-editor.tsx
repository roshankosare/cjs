import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import Editor from "@monaco-editor/react";
import { BOILERPLATE } from "./constant";
type Language = "node" | "java" | "cpp";
const CodeEditor = () => {
  const [language, setLanguage] = useState<Language>("node");
  const [code, setCode] = useState(BOILERPLATE.node);
  const handleRun = () => {
    console.log("Run code:", { language, code });
  };

  const handleSubmit = () => {
    console.log("Submit code:", { language, code });
  };

  return (
    <div className="w-full h-full sm:mih-h-[600px] flex flex-col border rounded-lg bg-background px-2 py-2 gap-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b py-2">
        <div className="w-48">
          <Select
            value={language}
            onValueChange={(lang) => {
              setLanguage(lang as Language);
              setCode(BOILERPLATE[lang]);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="node">Node.js</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="java">Java</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />
      </div>
      <div className="w-full">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRun}
            className="bg-blue-600 text-white w-30"
          >
            Run
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-green-600 text-white w-30"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
