import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowUpRight, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [search, setSearch] = useState("");

  const chartData = [
    { name: "Jan", income: 1200, expense: 800 },
    { name: "Feb", income: 1500, expense: 900 },
    { name: "Mar", income: 1700, expense: 1100 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white p-8">
      <motion.h1
        className="text-4xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Expense Tracker Dashboard
      </motion.h1>

      {/* Top Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {[
          { title: "Total Income", value: "$0.00", change: "+5.4%" },
          { title: "Total Expenses", value: "$0.00", change: "+2.1%" },
          { title: "Balance", value: "$0.00", change: "+3.3%" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
          >
            <Card className="backdrop-blur-2xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex justify-between items-center">
                  {stat.title}
                  <ArrowUpRight className="h-5 w-5 text-green-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-green-400 mt-1 text-sm">{stat.change} from last month</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white/10 rounded-2xl p-6 mb-8 flex flex-wrap gap-4 items-center justify-between">
        <Input
          placeholder="Search transactions..."
          className="max-w-sm bg-white/10 border-white/30 text-white placeholder:text-gray-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex gap-4">
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            CSV
          </Button>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            PDF
          </Button>
          <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Chart */}
      <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Expense Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e1e2f",
                  borderRadius: "10px",
                  border: "none",
                }}
              />
              <Bar dataKey="income" fill="#4ade80" radius={[5, 5, 0, 0]} />
              <Bar dataKey="expense" fill="#f87171" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Transactions */}
      <Card className="bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Transactions</CardTitle>
        </CardHeader>
        <CardContent className="text-gray-300 text-center py-10">
          <p className="text-lg">No transactions found — start by adding your first transaction.</p>
        </CardContent>
      </Card>
    </div>
  );
}
