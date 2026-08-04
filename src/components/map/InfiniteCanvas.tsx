"use client";

import { useState, useCallback, useMemo } from "react";
import {
  TransformWrapper,
  TransformComponent,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { CategoryOrb } from "./CategoryOrb";
import { TopicNode } from "./TopicNode";
import { ConnectionLine } from "./ConnectionLine";
import { MapControls } from "./MapControls";
import type { Category, Topic } from "@/lib/types";

interface CategoryWithTopics extends Category {
  topics: Topic[];
}

interface InfiniteCanvasProps {
  categories: CategoryWithTopics[];
}

/**
 * Calculate topic positions in a circle around the parent category.
 * Returns an array of {offsetX, offsetY} relative to the category center.
 */
function getTopicPositions(
  topicCount: number,
  radius: number = 160
): { offsetX: number; offsetY: number }[] {
  if (topicCount === 0) return [];
  if (topicCount === 1) return [{ offsetX: 0, offsetY: -radius }];

  return Array.from({ length: topicCount }, (_, i) => {
    const angle = (2 * Math.PI * i) / topicCount - Math.PI / 2;
    return {
      offsetX: Math.cos(angle) * radius,
      offsetY: Math.sin(angle) * radius,
    };
  });
}

/**
 * Automatically spread categories across the canvas if they all have default positions (0,0).
 * Creates a nice organic layout.
 */
function autoLayoutCategories(categories: CategoryWithTopics[]): CategoryWithTopics[] {
  const allDefault = categories.every(
    (c) => c.position_x === 0 && c.position_y === 0
  );

  if (!allDefault || categories.length === 0) return categories;

  const centerX = 1500;
  const centerY = 1000;
  const baseRadius = Math.max(350, categories.length * 120);

  return categories.map((cat, i) => {
    const angle = (2 * Math.PI * i) / categories.length - Math.PI / 2;
    return {
      ...cat,
      position_x: centerX + Math.cos(angle) * baseRadius,
      position_y: centerY + Math.sin(angle) * baseRadius,
    };
  });
}

export function InfiniteCanvas({ categories }: InfiniteCanvasProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [transformRef, setTransformRef] = useState<ReactZoomPanPinchRef | null>(null);

  // Auto-layout if needed
  const layoutCategories = useMemo(
    () => autoLayoutCategories(categories),
    [categories]
  );

  // Calculate canvas bounds
  const canvasSize = useMemo(() => {
    if (layoutCategories.length === 0) return { width: 3000, height: 2000 };
    const xs = layoutCategories.map((c) => c.position_x);
    const ys = layoutCategories.map((c) => c.position_y);
    const padding = 500;
    return {
      width: Math.max(3000, Math.max(...xs) - Math.min(...xs) + padding * 2),
      height: Math.max(2000, Math.max(...ys) - Math.min(...ys) + padding * 2),
    };
  }, [layoutCategories]);

  const handleOrbClick = useCallback(
    (categoryId: string, x: number, y: number) => {
      setActiveCategory((prev) => (prev === categoryId ? null : categoryId));

      // Smooth zoom to the category
      if (transformRef) {
        const scale = 1.2;
        transformRef.setTransform(
          -(x * scale) + window.innerWidth / 2,
          -(y * scale) + window.innerHeight / 2,
          scale,
          500,
          "easeInOutCubic"
        );
      }
    },
    [transformRef]
  );

  const handleZoomIn = useCallback(() => {
    transformRef?.zoomIn(0.3, 200);
  }, [transformRef]);

  const handleZoomOut = useCallback(() => {
    transformRef?.zoomOut(0.3, 200);
  }, [transformRef]);

  const handleReset = useCallback(() => {
    transformRef?.resetTransform(400);
    setActiveCategory(null);
  }, [transformRef]);

  // Build connection lines data
  const connections = useMemo(() => {
    const lines: {
      key: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      color: string;
    }[] = [];

    for (const cat of layoutCategories) {
      if (!activeCategory || activeCategory === cat.id) {
        const topicPositions = getTopicPositions(cat.topics.length);
        cat.topics.forEach((topic, i) => {
          const pos = topicPositions[i];
          lines.push({
            key: `${cat.id}-${topic.id}`,
            x1: cat.position_x,
            y1: cat.position_y,
            x2: cat.position_x + pos.offsetX,
            y2: cat.position_y + pos.offsetY,
            color: cat.color_hex || "#8b5cf6",
          });
        });
      }
    }
    return lines;
  }, [layoutCategories, activeCategory]);

  if (categories.length === 0) {
    return (
      <div className="map-container" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="empty-state">
          <div className="empty-state-icon">🗺️</div>
          <div className="empty-state-title">El mapa está vacío</div>
          <p className="empty-state-text">
            Crea categorías y temas desde el panel de admin para poblar el mapa.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="map-container">
      <TransformWrapper
        ref={(ref) => setTransformRef(ref)}
        initialScale={0.5}
        minScale={0.15}
        maxScale={3}
        centerOnInit={true}
        limitToBounds={false}
        wheel={{ step: 0.08 }}
        pinch={{ step: 5 }}
        panning={{ velocityDisabled: false }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent
          wrapperStyle={{
            width: "100%",
            height: "100%",
          }}
          contentStyle={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
          }}
        >
          {/* SVG layer for connection lines */}
          <svg
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            {connections.map(({ key, ...lineProps }) => (
              <ConnectionLine key={key} {...lineProps} />
            ))}
          </svg>

          {/* Category orbs */}
          {layoutCategories.map((cat) => (
            <CategoryOrb
              key={cat.id}
              category={cat}
              isActive={activeCategory === cat.id}
              topicCount={cat.topics.length}
              onClick={() =>
                handleOrbClick(cat.id, cat.position_x, cat.position_y)
              }
            />
          ))}

          {/* Topic nodes — show for active category, or all if none active */}
          {layoutCategories.map((cat) => {
            const showTopics = !activeCategory || activeCategory === cat.id;
            if (!showTopics || cat.topics.length === 0) return null;

            const positions = getTopicPositions(cat.topics.length);

            return cat.topics.map((topic, i) => (
              <TopicNode
                key={topic.id}
                topic={topic}
                categorySlug={cat.slug}
                categoryColor={cat.color_hex || "#8b5cf6"}
                offsetX={positions[i].offsetX}
                offsetY={positions[i].offsetY}
                parentX={cat.position_x}
                parentY={cat.position_y}
              />
            ));
          })}

          {/* Decorative grid dots */}
          <svg
            width={canvasSize.width}
            height={canvasSize.height}
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: -1,
              opacity: 0.08,
            }}
          >
            <pattern
              id="grid-dots"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid-dots)" />
          </svg>
        </TransformComponent>
      </TransformWrapper>

      {/* Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />
    </div>
  );
}
