'use client';

import { useState, useRef } from 'react';

interface Component {
  id: string;
  type: string;
  x: number;
  y: number;
  content?: string;
  width?: number;
  height?: number;
}

export default function BuilderPage() {
  const [canvasComponents, setCanvasComponents] = useState<Component[]>([]);
  const [draggingComponent, setDraggingComponent] = useState<Component | null>(null);
  const [draggingType, setDraggingType] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isCanvasDragging, setIsCanvasDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const components = [
    { type: 'text', label: '文本', icon: '📝', color: 'bg-blue-500' },
    { type: 'image', label: '图片', icon: '🖼️', color: 'bg-green-500' },
    { type: 'button', label: '按钮', icon: '🔘', color: 'bg-purple-500' },
    { type: 'card', label: '卡片', icon: '📦', color: 'bg-orange-500' },
    { type: 'header', label: '标题', icon: 'H1', color: 'bg-pink-500' },
    { type: 'divider', label: '分割线', icon: '➖', color: 'bg-gray-500' },
  ];

  const handleDragStart = (e: React.DragEvent, type: string) => {
    e.dataTransfer.setData('componentType', type);
    setDraggingType(type);
  };

  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('componentType');
    if (!type || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newComponent: Component = {
      id: `comp-${Date.now()}`,
      type,
      x,
      y,
      content: getDefaultContent(type),
      width: getDefaultWidth(type),
      height: getDefaultHeight(type),
    };

    setCanvasComponents([...canvasComponents, newComponent]);
    setDraggingType(null);
  };

  const getDefaultContent = (type: string): string => {
    switch (type) {
      case 'text': return '这是一段文本内容';
      case 'button': return '点击按钮';
      case 'header': return '标题';
      case 'card': return '卡片内容';
      case 'image': return '图片';
      case 'divider': return '';
      default: return '';
    }
  };

  const getDefaultWidth = (type: string): number => {
    switch (type) {
      case 'text': return 200;
      case 'button': return 120;
      case 'header': return 300;
      case 'card': return 250;
      case 'image': return 200;
      case 'divider': return 400;
      default: return 150;
    }
  };

  const getDefaultHeight = (type: string): number => {
    switch (type) {
      case 'text': return 60;
      case 'button': return 40;
      case 'header': return 50;
      case 'card': return 150;
      case 'image': return 150;
      case 'divider': return 2;
      default: return 100;
    }
  };

  const handleComponentMouseDown = (e: React.MouseEvent, component: Component) => {
    e.stopPropagation();
    setSelectedId(component.id);
    setDraggingComponent(component);
    setIsCanvasDragging(true);
    dragOffset.current = {
      x: e.clientX - component.x,
      y: e.clientY - component.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isCanvasDragging && draggingComponent && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;

      setCanvasComponents(
        canvasComponents.map((comp) =>
          comp.id === draggingComponent.id
            ? { ...comp, x: Math.max(0, Math.min(newX, rect.width - comp.width!)) }
            : comp
        )
      );
    }
  };

  const handleMouseUp = () => {
    setIsCanvasDragging(false);
    setDraggingComponent(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setCanvasComponents(canvasComponents.filter((comp) => comp.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleClearAll = () => {
    setCanvasComponents([]);
    setSelectedId(null);
  };

  const renderComponent = (component: Component) => {
    const isSelected = selectedId === component.id;
    const baseStyle = `absolute transition-shadow cursor-move ${
      isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1'
    }`;

    switch (component.type) {
      case 'text':
        return (
          <div
            style={{ left: component.x, top: component.y, width: component.width, minHeight: component.height }}
            className={`${baseStyle} p-3 bg-white rounded-lg shadow-md`}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
          >
            <p className="text-gray-700 text-sm">{component.content}</p>
            {isSelected && (
              <button
                onClick={(e) => handleDelete(e, component.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        );

      case 'button':
        return (
          <div
            style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
            className={`${baseStyle} flex items-center justify-center`}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
          >
            <button className="w-full h-full bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              {component.content}
            </button>
            {isSelected && (
              <button
                onClick={(e) => handleDelete(e, component.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        );

      case 'header':
        return (
          <div
            style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
            className={`${baseStyle} flex items-center`}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
          >
            <h1 className="text-2xl font-bold text-gray-800">{component.content}</h1>
            {isSelected && (
              <button
                onClick={(e) => handleDelete(e, component.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        );

      case 'card':
        return (
          <div
            style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
            className={`${baseStyle} bg-white rounded-xl shadow-lg p-4`}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
          >
            <div className="w-full h-20 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg mb-3"></div>
            <h3 className="font-semibold text-gray-800">卡片标题</h3>
            <p className="text-gray-600 text-sm mt-1">卡片描述内容</p>
            {isSelected && (
              <button
                onClick={(e) => handleDelete(e, component.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        );

      case 'image':
        return (
          <div
            style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
            className={`${baseStyle} bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center`}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
          >
            <span className="text-gray-500 text-4xl">🖼️</span>
            {isSelected && (
              <button
                onClick={(e) => handleDelete(e, component.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        );

      case 'divider':
        return (
          <div
            style={{ left: component.x, top: component.y, width: component.width, height: component.height }}
            className={`${baseStyle} flex items-center`}
            onMouseDown={(e) => handleComponentMouseDown(e, component)}
          >
            <div className="w-full h-px bg-gray-300"></div>
            {isSelected && (
              <button
                onClick={(e) => handleDelete(e, component.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 顶部导航 */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">可视化建站工具</h1>
        <button
          onClick={handleClearAll}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          清空画布
        </button>
      </div>

      <div className="flex h-[calc(100vh-65px)]">
        {/* 左侧组件工具栏 */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 overflow-y-auto">
          <h2 className="text-lg font-semibold text-white mb-4">组件库</h2>
          <div className="space-y-3">
            {components.map((comp) => (
              <div
                key={comp.type}
                draggable
                onDragStart={(e) => handleDragStart(e, comp.type)}
                className={`${comp.color} p-4 rounded-lg cursor-move text-white text-center font-medium shadow-lg hover:scale-105 hover:shadow-xl transition-all`}
              >
                <div className="text-2xl mb-1">{comp.icon}</div>
                <div>{comp.label}</div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-3 bg-gray-700 rounded-lg">
            <p className="text-gray-300 text-sm">
              💡 提示：拖拽组件到画布上，点击选中后可以移动位置
            </p>
          </div>
        </div>

        {/* 中间画布区域 */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onDragOver={handleCanvasDragOver}
            onDrop={handleCanvasDrop}
            className="relative bg-white rounded-xl shadow-xl min-h-full"
            style={{ minHeight: '800px' }}
          >
            {/* 网格背景 */}
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: 'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}></div>

            {/* 已放置的组件 */}
            {canvasComponents.map((component) => (
              <div key={component.id}>
                {renderComponent(component)}
              </div>
            ))}

            {/* 空状态提示 */}
            {canvasComponents.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <p className="text-gray-400 text-lg">从左侧拖拽组件到这里开始建站</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
