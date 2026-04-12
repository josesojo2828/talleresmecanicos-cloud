"use client";

import React, { useEffect, useState } from "react";
import {
   AreaChart, Area, PieChart, Pie, Cell,
   XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import {
   TrendingUp, DollarSign, Wrench, Package, Settings, ArrowRight,
} from "lucide-react";
import apiClient from "@/utils/api/api.client";
import { toast } from "sonner";

export default function FinanceDashboard() {
   const [data, setData] = useState<any>(null);
   const [loading, setLoading] = useState(true);

   const COLORS = ["#10b981", "#3b82f6", "#6366f1", "#f59e0b", "#ef4444"];

   const fetchStats = async () => {
      try {
         setLoading(true);
         const data: any = await apiClient.get("/workshop/finance/stats");
         const entity = data.data.body.body;
         setData(entity);
      } catch (error: any) {
         toast.error("Error al sincronizar datos financieros");
         console.error(error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchStats();
   }, []);

   if (loading) {
      return (
         <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
            <div className="w-16 h-16 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Sincronizando Libro Diario...</p>
         </div>
      );
   }

   const { stats, chartData, pieData, recentTransactions } = data || {};

   return (
      <div className="min-h-screen bg-[#f8fafc] p-8 text-slate-900 font-sans">

         <div className="flex flex-col xl:flex-row gap-8">

            {/* Left Side - Main Content (Cols 8 approx) */}
            <div className="flex-1 space-y-8">

               <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-950">Dashboard <span className="text-emerald-600 outline-text">Financiero</span></h1>

               {/* Row 1: Top Stats Cards */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                     title="Earnings"
                     amount={`$${stats?.totalIncome?.toLocaleString() || '0'}`}
                     percent="+12.8%"
                     diff={`+$${(stats?.totalIncome * 0.1 || 0).toFixed(0)} than last month`}
                     icon={<DollarSign className="w-6 h-6" />}
                     color="text-emerald-600"
                  />
                  <StatCard
                     title="Spending's"
                     amount={`$${stats?.totalParts?.toLocaleString() || '0'}`}
                     percent="+2.4%"
                     diff={`-$${(stats?.totalParts * 0.05 || 0).toFixed(0)} than last month`}
                     icon={<Package className="w-6 h-6" />}
                     color="text-blue-600"
                  />
                  <StatCard
                     title="Inventory Stock"
                     amount={`$${stats?.inventoryValue?.toLocaleString() || '0'}`}
                     percent="+6.7%"
                     diff={`+$${(stats!?.inventoryValue * 0.02 || 0).toFixed(0)} in assets`}
                     icon={<TrendingUp className="w-6 h-6" />}
                     color="text-indigo-600"
                  />
               </div>

               {/* Row 2: Balance Summary Chart */}
               <div className="bg-white p-3 rounded-md shadow-sm border border-slate-100 relative group overflow-hidden">
                  <div className="flex justify-between items-center mb-10">
                     <div>
                        <h2 className="text-xl font-black uppercase italic tracking-tighter">Balance Summary</h2>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Evolución de ingresos operativos</p>
                     </div>
                     <select className="bg-slate-50 border-none rounded-xl text-xs font-bold uppercase py-2 px-4 outline-none appearance-none cursor-pointer">
                        <option>Marzo 2026</option>
                        <option>Febrero 2026</option>
                     </select>
                  </div>
                  <div className="h-[350px] min-h-[350px] w-full">
                     <ResponsiveContainer width="100%" height="100%" minHeight={350}>
                        <AreaChart data={chartData}>
                           <defs>
                              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                           <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                           <Tooltip
                              contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px' }}
                           />
                           <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorIncome)" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

            </div>

            {/* Right Side - Cards & Quick Actions (Cols 4 approx) */}
            <div className="w-full xl:w-96 space-y-8 pt-16">
               <div className="space-y-8">
                  {/* Customer Growth Mock */}
                  <div className="bg-white p-3 rounded-md shadow-sm border border-slate-100 flex items-center gap-8 h-fit">
                     <div className="relative w-32 h-32 shrink-0 min-h-[128px]">
                        <ResponsiveContainer width="100%" height="100%" minHeight={128}>
                           <PieChart>
                              <Pie
                                 data={pieData}
                                 innerRadius={40}
                                 outerRadius={55}
                                 paddingAngle={5}
                                 cornerRadius={5}
                                 dataKey="value"
                              >
                                 {pieData?.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                 ))}
                              </Pie>
                           </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                           <p className="text-sm font-black leading-none">{stats?.uniqueClients || 0}</p>
                           <p className="text-[8px] font-bold uppercase text-slate-400">Clients</p>
                        </div>
                     </div>
                     <div>
                        <h4 className="text-lg font-black uppercase italic tracking-tighter">Customer Growth</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 mb-4 italic">Interacción del periodo</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                           {pieData?.map((p: any, i: number) => (
                              <div key={p.name} className="flex items-center gap-2">
                                 <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                 <span className="text-[9px] font-black uppercase text-slate-600">{p.label}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Expenses Summary Mock */}
                  <div className="bg-white p-3 rounded-md shadow-sm border border-slate-100 flex-1">
                     <div className="flex justify-between items-center mb-8">
                        <h4 className="text-lg font-black uppercase italic tracking-tighter">Expenses Summary</h4>
                        <select className="bg-slate-50 border-none rounded-xl text-[10px] font-bold uppercase p-2 outline-none">
                           <option>March</option>
                        </select>
                     </div>

                     <div className="flex items-center gap-10">
                        <div className="relative w-40 h-40 min-h-[160px]">
                           <ResponsiveContainer width="100%" height="100%" minHeight={160}>
                              <PieChart>
                                 <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    startAngle={180}
                                    endAngle={-180}
                                    dataKey="value"
                                 >
                                    <Cell fill="#10b981" />
                                    <Cell fill="#f1f5f9" />
                                 </Pie>
                              </PieChart>
                           </ResponsiveContainer>
                           <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-[8px] font-bold text-slate-400 uppercase">Total</span>
                              <span className="text-xl font-black">${stats?.totalParts?.toLocaleString() || '0'}</span>
                           </div>
                        </div>

                        <div className="flex-1 space-y-4">
                           <ExpenseItem icon={<Settings className="w-4 h-4" />} title="Repuestos" amount={`$${stats?.totalParts?.toLocaleString() || '0'}`} color="text-emerald-500" />
                           <ExpenseItem icon={<Wrench className="w-4 h-4" />} title="Labor" amount={`$${stats?.totalLabor?.toLocaleString() || '0'}`} color="text-slate-400" />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}

function StatCard({ title, amount, percent, diff, icon, color }: any) {
   return (
      <div className="bg-white p-3 rounded-md shadow-sm border border-slate-100 relative group overflow-hidden hover:shadow-xl transition-all duration-500">
         <div className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center ${color} mb-6 group-hover:scale-110 transition-transform duration-500`}>
            {icon}
         </div>
         <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
            <div className="flex items-baseline gap-3 mb-4">
               <h3 className="text-3xl font-black text-slate-950 tracking-tighter leading-none">{amount}</h3>
               <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full">{percent}</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{diff}</p>
         </div>
      </div>
   );
}

function ExpenseItem({ icon, title, amount, color }: any) {
   return (
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-slate-50 ${color}`}>{icon}</div>
            <span className="text-[10px] font-black uppercase text-slate-600 tracking-wider font-sans">{title}</span>
         </div>
         <span className="text-xs font-black italic tracking-tight">{amount}</span>
      </div>
   );
}
