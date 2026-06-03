import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, TrendingUp, BarChart3 } from 'lucide-react';
import { getRestaurantByName, getSalesByDate, getSalesByMonth, getSalesByYear, getEmployeeSales, getEmployees } from '../lib/api';
import { Restaurant } from '../lib/supabase';

interface SalesData {
  sale_date?: string;
  month?: string;
  year?: number;
  total_orders: number;
  total_revenue: number;
  total_tax: number;
  total_tips: number;
  avg_order: number;
  cash_count: number;
  card_count: number;
  nequi_count: number;
  daviplata_count: number;
}

interface EmployeeSales {
  employee_id: string;
  employee_name: string;
  position: string;
  sale_date?: string;
  total_orders: number;
  total_sales: number;
  total_tips: number;
  avg_order: number;
}

export default function ReportsPage() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [reportType, setReportType] = useState<'day' | 'month' | 'year' | 'employee'>('day');
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [dayData, setDayData] = useState<SalesData | null>(null);
  const [monthData, setMonthData] = useState<SalesData[]>([]);
  const [yearData, setYearData] = useState<SalesData[]>([]);
  const [employeeData, setEmployeeData] = useState<EmployeeSales[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const rest = await getRestaurantByName('Restaurante Demo');
        if (!rest) throw new Error('Restaurant not found');
        setRestaurant(rest);

        // Load initial data based on report type
        if (reportType === 'day') {
          const data = await getSalesByDate(rest.id, selectedDate);
          setDayData(data as any);
        } else if (reportType === 'month') {
          const data = await getSalesByMonth(rest.id);
          setMonthData(data as any);
        } else if (reportType === 'year') {
          const data = await getSalesByYear(rest.id);
          setYearData(data as any);
        } else if (reportType === 'employee') {
          const data = await getEmployeeSales(rest.id, selectedDate);
          setEmployeeData(data as any);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, [reportType, selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <span className="text-4xl animate-bounce">📊</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-40">
        <div className="container-wide section-padding py-4 flex items-center justify-between">
          <a href="/admin" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors font-medium">
            <ArrowLeft className="w-5 h-5" />
            Volver
          </a>
          <h1 className="font-display text-2xl font-bold text-white">Reportes Detallados</h1>
          <div></div>
        </div>
      </div>

      <div className="container-wide section-padding py-8">
        {/* Report Type Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { type: 'day', label: '📅 Por Día', icon: Calendar },
            { type: 'month', label: '📊 Por Mes', icon: TrendingUp },
            { type: 'year', label: '📈 Por Año', icon: BarChart3 },
            { type: 'employee', label: '👥 Empleados', icon: '' },
          ].map((item: any) => (
            <button
              key={item.type}
              onClick={() => setReportType(item.type)}
              className={`p-4 rounded-xl font-semibold transition-all ${
                reportType === item.type
                  ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/50'
                  : 'bg-white/10 text-slate-300 hover:bg-white/20 border border-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Date Picker for Day/Employee */}
        {(reportType === 'day' || reportType === 'employee') && (
          <div className="mb-8">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        )}

        {/* Day Report */}
        {reportType === 'day' && dayData && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Órdenes', value: dayData.total_orders, color: 'from-blue-500 to-blue-600' },
                { label: 'Ingresos', value: `$${Math.round(dayData.total_revenue).toLocaleString('es-CO')}`, color: 'from-emerald-500 to-emerald-600' },
                { label: 'Impuestos', value: `$${Math.round(dayData.total_tax).toLocaleString('es-CO')}`, color: 'from-purple-500 to-purple-600' },
                { label: 'Propinas', value: `$${Math.round(dayData.total_tips).toLocaleString('es-CO')}`, color: 'from-orange-500 to-orange-600' },
              ].map((stat) => (
                <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-xl p-6 text-white`}>
                  <p className="text-sm text-white/80">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-bold text-white mb-4">Desglose de Medios de Pago</h3>
              <div className="space-y-3">
                {[
                  { method: 'Efectivo', count: dayData.cash_count, color: 'from-green-500 to-green-600' },
                  { method: 'Tarjeta', count: dayData.card_count, color: 'from-blue-500 to-blue-600' },
                  { method: 'Nequi', count: dayData.nequi_count, color: 'from-purple-500 to-purple-600' },
                  { method: 'Daviplata', count: dayData.daviplata_count, color: 'from-orange-500 to-orange-600' },
                ].map((item) => (
                  <div key={item.method}>
                    <div className="flex justify-between mb-1">
                      <span className="text-white font-medium">{item.method}</span>
                      <span className="text-white font-bold">{item.count}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${item.color} h-2 rounded-full`}
                        style={{ width: `${((item.count / (dayData.total_orders || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Month Report */}
        {reportType === 'month' && (
          <>
            {monthData.length > 0 ? (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 overflow-x-auto">
                <h3 className="text-lg font-bold text-white mb-4">Ventas Mensuales (Últimos 12 meses)</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-slate-400">Mes</th>
                      <th className="px-4 py-3 text-center text-slate-400">Órdenes</th>
                      <th className="px-4 py-3 text-right text-slate-400">Ingresos</th>
                      <th className="px-4 py-3 text-right text-slate-400">Promedio</th>
                      <th className="px-4 py-3 text-right text-slate-400">Propinas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthData.map((month, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-white font-medium">
                          {month.month ? new Date(month.month + '-01').toLocaleDateString('es-CO', { year: 'numeric', month: 'long' }) : '-'}
                        </td>
                        <td className="px-4 py-3 text-center text-white">{month.total_orders}</td>
                        <td className="px-4 py-3 text-right text-emerald-400 font-semibold">
                          ${Math.round(month.total_revenue).toLocaleString('es-CO')}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-300">
                          ${Math.round(month.avg_order).toLocaleString('es-CO')}
                        </td>
                        <td className="px-4 py-3 text-right text-orange-400">
                          ${Math.round(month.total_tips).toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-12 text-center border border-white/10">
                <p className="text-slate-400">No hay datos de ventas mensuales</p>
              </div>
            )}
          </>
        )}

        {/* Year Report */}
        {reportType === 'year' && (
          <>
            {yearData.length > 0 ? (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 overflow-x-auto">
                <h3 className="text-lg font-bold text-white mb-4">Ventas Anuales</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-slate-400">Año</th>
                      <th className="px-4 py-3 text-center text-slate-400">Órdenes</th>
                      <th className="px-4 py-3 text-right text-slate-400">Ingresos</th>
                      <th className="px-4 py-3 text-right text-slate-400">Promedio</th>
                      <th className="px-4 py-3 text-right text-slate-400">Propinas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearData.map((year, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-white font-medium">{year.year}</td>
                        <td className="px-4 py-3 text-center text-white">{year.total_orders}</td>
                        <td className="px-4 py-3 text-right text-emerald-400 font-semibold">
                          ${Math.round(year.total_revenue).toLocaleString('es-CO')}
                        </td>
                        <td className="px-4 py-3 text-right text-slate-300">
                          ${Math.round(year.avg_order).toLocaleString('es-CO')}
                        </td>
                        <td className="px-4 py-3 text-right text-orange-400">
                          ${Math.round(year.total_tips).toLocaleString('es-CO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-12 text-center border border-white/10">
                <p className="text-slate-400">No hay datos de ventas anuales</p>
              </div>
            )}
          </>
        )}

        {/* Employee Report */}
        {reportType === 'employee' && (
          <>
            {employeeData.length > 0 ? (
              <div className="bg-white/5 rounded-xl p-6 border border-white/10 overflow-x-auto">
                <h3 className="text-lg font-bold text-white mb-4">Desempeño por Empleado ({selectedDate})</h3>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-left text-slate-400">Empleado</th>
                      <th className="px-4 py-3 text-center text-slate-400">Puesto</th>
                      <th className="px-4 py-3 text-center text-slate-400">Órdenes</th>
                      <th className="px-4 py-3 text-right text-slate-400">Ventas</th>
                      <th className="px-4 py-3 text-right text-slate-400">Promedio</th>
                      <th className="px-4 py-3 text-right text-slate-400">Propinas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeData
                      .sort((a, b) => (b.total_sales || 0) - (a.total_sales || 0))
                      .map((emp, idx) => (
                        <tr key={emp.employee_id} className="border-b border-white/5 hover:bg-white/5">
                          <td className="px-4 py-3 text-white font-medium">{emp.employee_name}</td>
                          <td className="px-4 py-3 text-center text-slate-300 text-xs">{emp.position}</td>
                          <td className="px-4 py-3 text-center text-white">{emp.total_orders || 0}</td>
                          <td className="px-4 py-3 text-right text-emerald-400 font-semibold">
                            ${Math.round(emp.total_sales || 0).toLocaleString('es-CO')}
                          </td>
                          <td className="px-4 py-3 text-right text-slate-300">
                            ${Math.round(emp.avg_order || 0).toLocaleString('es-CO')}
                          </td>
                          <td className="px-4 py-3 text-right text-orange-400">
                            ${Math.round(emp.total_tips || 0).toLocaleString('es-CO')}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white/5 rounded-xl p-12 text-center border border-white/10">
                <p className="text-slate-400">No hay datos de empleados para esta fecha</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
