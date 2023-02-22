import { useMutation, useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

import db from "@/lib/database";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import image from "@/assets/birds.jpg";
import { cn } from "./lib/utils";

function App() {
  const [account, setAccount] = useState<number | null>(null);
  const accounts = useQuery(["accounts"], async () => {
    const results = await db.select("SELECT * FROM accounts;");
    return results as {
      id: number;
      name: string;
      email: string;
      password: string;
      imap_host: string;
      imap_port: number;
      smtp_host: string;
      smtp_port: number;
    }[];
  });

  const fetchMail = useMutation(() => invoke("get_email", { account }));

  return (
    <div className="w-full h-screen flex items-stretch relative">
      <div
        className={cn(
          "flex flex-col items-center justify-center absolute left-0 transition-transform duration-300 delay-500 top-0 w-[600px] bg-white h-full overflow-auto",
          { "-translate-x-full": !accounts.isSuccess }
        )}
      >
        <Tabs defaultValue="account" className="w-[80%] h-[80%] flex flex-col">
          <TabsList className="w-max">
            <TabsTrigger value="account">Accounts</TabsTrigger>
            <TabsTrigger value="password">Add New Mailbox</TabsTrigger>
          </TabsList>
          <TabsContent
            value="account"
            className="flex-1 overflow-auto relative"
          >
            {accounts.data && accounts.data.length > 0 ? (
              accounts.data.map((account) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-2 space-x-2 rounded-md cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => setAccount(account.id)}
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-slate-500" />
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {account.email}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {account.name}
                    </div>
                    <div className="w-4 h-4 rounded-full bg-slate-500" />
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-500 dark:text-slate-400 text-center absolute top-1/2 left-1/2 -translate-x-1/2  -translate-y-1/2">
                No accounts found.
              </div>
            )}
          </TabsContent>
          <TabsContent value="password" className="flex-1 overflow-auto">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Add your email account details to connect it to Penfold.
            </p>
            <form
              className="grid gap-2 py-4"
              onSubmit={(evt) => {
                evt.preventDefault();
              }}
            >
              <div className="space-y-1">
                <Label htmlFor="name">Account Name</Label>
                <Input id="name" type="text" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="smtp_host">SMTP Host</Label>
                <Input id="smtp_host" type="text" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="smtp_port">SMTP Port</Label>
                <Input id="smtp_port" type="text" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="imap_host">IMAP Host</Label>
                <Input id="imap_host" type="text" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="imap_port">IMAP Port</Label>
                <Input id="imap_port" type="text" />
              </div>
              <div className="flex">
                <Button type="submit">Add Account</Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </div>
      <img src={image} className="object-cover flex-1 shrink" />
    </div>
  );
}

export default App;
