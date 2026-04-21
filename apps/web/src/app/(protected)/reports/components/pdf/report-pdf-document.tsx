'use client';

import { ReportAreaChartSvg } from '@/app/(protected)/reports/components/pdf/pdf-charts';
import {
  getReportCardWidth,
  pdfStyles as styles,
} from '@/app/(protected)/reports/components/pdf/pdf-design';
import { ReportMarkdownBlock } from '@/app/(protected)/reports/components/pdf/pdf-markdown';
import {
  getPdfReportBlocks,
  groupReportBlocks,
} from '@/app/(protected)/reports/report-block-utils';
import type {
  MockReport,
  ReportCardBlock,
  ReportGraphBlock,
  ReportTableBlock,
  ReportTextBlock,
} from '@/mock-data/reports';
import { Document, Page, Text, View } from '@react-pdf/renderer';
import ReactPDFChart from 'react-pdf-charts';

interface ReportPdfDocumentProps {
  fileName: string;
  report: MockReport;
}

export const ReportPdfDocument = ({
  fileName,
  report,
}: ReportPdfDocumentProps) => {
  const groups = groupReportBlocks(getPdfReportBlocks(report));

  return (
    <Document
      author="Atlas"
      creator="Atlas"
      subject="Report export"
      title={fileName}
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.intro}>
          <Text style={styles.introTitle}>{report.title}</Text>
        </View>
        <View style={styles.content}>
          {groups.map((group, index) => {
            if (group.type === 'text') {
              return (
                <View key={index} style={styles.textGroup}>
                  {group.blocks.filter(isReportTextBlock).map((block) => (
                    <ReportMarkdownBlock
                      key={block.id}
                      content={block.content}
                    />
                  ))}
                </View>
              );
            }

            if (group.type === 'card') {
              const cardBlocks = group.blocks.filter(isReportCardBlock);

              return (
                <View key={index} style={styles.cardGrid}>
                  {createCardRows(cardBlocks).map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.cardRow}>
                      {row.map((block) => (
                        <ReportCardBlockPdf
                          key={block.id}
                          block={block}
                          width={getReportCardWidth(cardBlocks.length)}
                        />
                      ))}
                    </View>
                  ))}
                </View>
              );
            }

            if (group.type === 'graph') {
              return (
                <View key={index} style={styles.graphGroup}>
                  {group.blocks.filter(isReportGraphBlock).map((block) => (
                    <ReportGraphBlockPdf key={block.id} block={block} />
                  ))}
                </View>
              );
            }

            return (
              <View key={index} style={styles.graphGroup}>
                {group.blocks.filter(isReportTableBlock).map((block) => (
                  <ReportTableBlockPdf key={block.id} block={block} />
                ))}
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

const ReportCardBlockPdf = ({
  block,
  width,
}: {
  block: ReportCardBlock;
  width: number;
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          width,
        },
      ]}
      wrap={false}
    >
      <Text style={styles.cardTitle}>{block.title}</Text>
      <Text style={styles.cardValue}>{block.value}</Text>
      {block.footer ? (
        <Text style={styles.cardFooter}>{block.footer}</Text>
      ) : null}
    </View>
  );
};

const ReportGraphBlockPdf = ({ block }: { block: ReportGraphBlock }) => {
  return (
    <View style={styles.graphCard} wrap={false}>
      <Text style={styles.graphTitle}>{block.title}</Text>
      {block.value ? (
        <Text style={styles.graphValue}>{block.value}</Text>
      ) : null}
      {block.caption ? (
        <Text style={styles.graphCaption}>{block.caption}</Text>
      ) : null}
      <View style={styles.graphSvgWrap}>
        <View style={styles.chartContainer}>
          <ReactPDFChart>
            <ReportAreaChartSvg data={block.data} />
          </ReactPDFChart>
        </View>
      </View>
      <View style={styles.graphLabels}>
        {block.data.map((point) => (
          <Text key={point.label} style={styles.graphLabel}>
            {point.label}
          </Text>
        ))}
      </View>
    </View>
  );
};

const ReportTableBlockPdf = ({ block }: { block: ReportTableBlock }) => {
  const columnWidth = `${100 / block.header.length}%`;

  return (
    <View style={styles.tableCard} wrap={false}>
      <View style={styles.tableHeader}>
        {block.header.map((heading) => (
          <View
            key={heading}
            style={[styles.tableCell, { width: columnWidth }]}
          >
            <Text style={styles.tableHeaderText}>{heading}</Text>
          </View>
        ))}
      </View>
      {block.rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.tableBodyRow}>
          {row.map((cell, cellIndex) => (
            <View
              key={cellIndex}
              style={[styles.tableCell, { width: columnWidth }]}
            >
              <Text style={styles.tableCellText}>{cell}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

function isReportTextBlock(block: { type: string }): block is ReportTextBlock {
  return block.type === 'text';
}

function isReportCardBlock(block: { type: string }): block is ReportCardBlock {
  return block.type === 'card';
}

function isReportGraphBlock(block: {
  type: string;
}): block is ReportGraphBlock {
  return block.type === 'graph';
}

function isReportTableBlock(block: {
  type: string;
}): block is ReportTableBlock {
  return block.type === 'table';
}

function createCardRows(blocks: ReportCardBlock[]) {
  const columnCount = getReportCardColumnCount(blocks.length);
  const rows: ReportCardBlock[][] = [];

  for (let index = 0; index < blocks.length; index += columnCount) {
    rows.push(blocks.slice(index, index + columnCount));
  }

  return rows;
}

function getReportCardColumnCount(blockCount: number) {
  return blockCount === 2 ? 2 : 3;
}
