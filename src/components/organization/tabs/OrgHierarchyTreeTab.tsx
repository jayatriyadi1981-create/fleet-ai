/**
 * Fleet Intelligence Smart AI - Visual Organization Hierarchy Tree
 * Interactive multi-level organizational chart (Company -> Branches -> Departments -> Fleets)
 */

import React, { useState } from 'react';
import { useOrganization } from '../../../context/OrganizationContext';
import { OrganizationTreeNode } from '../../../types/organization';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Truck, 
  ChevronRight, 
  ChevronDown, 
  User, 
  ShieldCheck, 
  Layers, 
  Maximize2, 
  Minimize2, 
  Search,
  ExternalLink,
  Plus
} from 'lucide-react';

interface TreeNodeProps {
  node: OrganizationTreeNode;
  level: number;
  expandedNodes: Record<string, boolean>;
  toggleNode: (id: string) => void;
  onSelectNode: (node: OrganizationTreeNode) => void;
  selectedNodeId: string | null;
}

const TreeNodeItem: React.FC<TreeNodeProps> = ({
  node,
  level,
  expandedNodes,
  toggleNode,
  onSelectNode,
  selectedNodeId,
}) => {
  const isExpanded = expandedNodes[node.id] !== false; // default expanded
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'COMPANY':
        return {
          icon: Building2,
          color: 'from-cyan-500 to-blue-600',
          text: 'text-cyan-300',
          bg: 'bg-cyan-950/40 border-cyan-500/30',
          label: 'TENANT / PERUSAHAAN',
        };
      case 'BRANCH':
        return {
          icon: MapPin,
          color: 'from-blue-500 to-indigo-600',
          text: 'text-blue-300',
          bg: 'bg-blue-950/40 border-blue-500/30',
          label: 'CABANG / DEPO',
        };
      case 'DEPARTMENT':
        return {
          icon: Briefcase,
          color: 'from-purple-500 to-pink-600',
          text: 'text-purple-300',
          bg: 'bg-purple-950/40 border-purple-500/30',
          label: 'DEPARTEMEN / DIVISI',
        };
      case 'FLEET':
      default:
        return {
          icon: Truck,
          color: 'from-emerald-500 to-teal-600',
          text: 'text-emerald-300',
          bg: 'bg-emerald-950/40 border-emerald-500/30',
          label: 'SUB-ARMADA / FLEET',
        };
    }
  };

  const badge = getTypeBadge(node.type);
  const Icon = badge.icon;

  return (
    <div className="relative">
      {/* Node Card Row */}
      <div
        className={`group relative flex items-center justify-between rounded-xl border p-3.5 transition-all cursor-pointer ${
          isSelected
            ? 'border-cyan-500 bg-cyan-950/40 shadow-lg shadow-cyan-950/50'
            : 'border-slate-800/80 bg-slate-900/90 hover:border-slate-700 hover:bg-slate-900'
        }`}
        style={{ marginLeft: `${level * 24}px` }}
        onClick={() => onSelectNode(node)}
      >
        {/* Left Connection Guide Lines */}
        {level > 0 && (
          <div
            className="absolute -left-4 top-1/2 w-4 h-0.5 bg-slate-800"
            aria-hidden="true"
          />
        )}

        <div className="flex items-center gap-3">
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
              className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            </button>
          ) : (
            <div className="h-6 w-6 flex items-center justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-700" />
            </div>
          )}

          {/* Node Icon Box */}
          <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${badge.color} text-slate-950 font-bold shadow-md shrink-0`}>
            <Icon className="h-4.5 w-4.5" />
          </div>

          {/* Name & Code */}
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                {node.name}
              </h4>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 border border-slate-700 text-slate-300">
                {node.code}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold border ${badge.bg} ${badge.text}`}>
                {badge.label}
              </span>
              {node.managerName && (
                <span className="flex items-center gap-1 text-slate-400">
                  <User className="h-3 w-3 text-slate-500" />
                  {node.managerName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Status & Metric Badges */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-cyan-400">
              {node.vehiclesCount || 0} Unit
            </span>
            <span className="block text-[10px] text-slate-500 uppercase tracking-wider">Armada</span>
          </div>

          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
              node.status === 'active'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {node.status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Children Nodes Recursion */}
      {hasChildren && isExpanded && (
        <div className="space-y-2 mt-2">
          {node.children!.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              onSelectNode={onSelectNode}
              selectedNodeId={selectedNodeId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const OrgHierarchyTreeTab: React.FC = () => {
  const { orgTree, currentTenant, branches, departments, fleets } = useOrganization();
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  const [selectedNode, setSelectedNode] = useState<OrganizationTreeNode | null>(orgTree);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [id]: prev[id] === false ? true : false,
    }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    const traverse = (n: OrganizationTreeNode) => {
      all[n.id] = true;
      n.children?.forEach(traverse);
    };
    traverse(orgTree);
    setExpandedNodes(all);
  };

  const collapseAll = () => {
    const all: Record<string, boolean> = {};
    const traverse = (n: OrganizationTreeNode) => {
      all[n.id] = false;
      n.children?.forEach(traverse);
    };
    traverse(orgTree);
    setExpandedNodes(all);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            Struktur Hirarki Organisasi (Org Tree)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Navigasi visual multi-level entitas: Perusahaan &rarr; Cabang (Depo) &rarr; Departemen &rarr; Sub-Armada.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span>Expand Semua</span>
          </button>
          <button
            onClick={collapseAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold transition-colors"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Collapse</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Visual Tree vs Node Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Tree */}
        <div className="lg:col-span-2 space-y-3 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 min-h-[480px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-500">
              Hirarki Organisasi Aktif ({currentTenant.name})
            </span>
            <span className="font-mono text-cyan-400">
              Total {branches.length} Cabang • {departments.length} Divisi • {fleets.length} Sub-Armada
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <TreeNodeItem
              node={orgTree}
              level={0}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              onSelectNode={(node) => setSelectedNode(node)}
              selectedNodeId={selectedNode?.id || null}
            />
          </div>
        </div>

        {/* Right 1 Col: Selected Entity Deep Dive */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Detail Node Terpilih
              </span>
              {selectedNode && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {selectedNode.type}
                </span>
              )}
            </div>

            {selectedNode ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-bold text-white">{selectedNode.name}</h4>
                  <p className="text-xs font-mono text-cyan-400 mt-0.5">KODE: {selectedNode.code}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <span className="block text-[10px] text-slate-400 font-medium">TOTAL UNIT</span>
                    <span className="text-xl font-bold font-mono text-white mt-1">
                      {selectedNode.vehiclesCount || 0}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                    <span className="block text-[10px] text-slate-400 font-medium">STATUS OPERASI</span>
                    <span className="text-xs font-bold font-mono text-emerald-400 mt-2 block uppercase">
                      {selectedNode.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2 border-t border-slate-800 text-xs">
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Penanggung Jawab:</span>
                    <span className="font-semibold text-slate-200">{selectedNode.managerName || '-'}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Jumlah Sub-Elemen:</span>
                    <span className="font-semibold text-cyan-400">{selectedNode.children?.length || 0} Child Nodes</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Data Isolation:</span>
                    <span className="font-mono text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Strict RLS Scoped
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-500 text-xs">
                Klik salah satu node di pohon organisasi untuk melihat rincian wewenang dan armada.
              </div>
            )}
          </div>

          {/* Quick Hierarchy Info Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs text-slate-400 space-y-2">
            <h5 className="font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              Prinsip Hirarki Multi-Tenant
            </h5>
            <p className="leading-relaxed text-[11px]">
              Setiap user yang diberi role Kepala Cabang hanya dapat mengakses branchId yang ditetapkan. Data armada, pengemudi, order BBM, dan histori GPS secara otomatis terisolasi pada level query database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
