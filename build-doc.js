const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, PageBreak, WidthType, ShadingType, BorderStyle,
  Footer, Header, PageNumber } = require('docx')

const fs = require('fs')

const borderSingle = { style: BorderStyle.SINGLE, size: 1, color: 'AAAAAA' }
const tableBorders = { top: borderSingle, bottom: borderSingle, left: borderSingle, right: borderSingle }
const cellMargins = { top: 40, bottom: 40, left: 80, right: 80 }

function makeTableCell(text, bold, opts) {
  opts = opts || {}
  const p = new Paragraph({
    children: [new TextRun({ text: text || '', bold: !!bold, size: 22, font: 'Arial' })],
    spacing: { before: 40, after: 40 },
    alignment: opts.align || AlignmentType.LEFT,
  })
  const cellOpts = {
    borders: tableBorders,
    margins: cellMargins,
    children: [p],
  }
  if (opts.shade) {
    cellOpts.shading = { type: ShadingType.CLEAR, fill: opts.shade }
  }
  return new TableCell(cellOpts)
}

function makeTable(rows, colWidths) {
  const tableOpts = {
    width: WidthType.FIXED,
    columnWidths: colWidths,
    rows: rows,
    borders: { top: { style: BorderStyle.NONE, size: 0 }, bottom: { style: BorderStyle.NONE, size: 0 }, left: { style: BorderStyle.NONE, size: 0 }, right: { style: BorderStyle.NONE, size: 0 }, insideHorizontal: { style: BorderStyle.NONE, size: 0 }, insideVertical: { style: BorderStyle.NONE, size: 0 } },
  }
  return new Table(tableOpts)
}

const children = []

function addH1(text) {
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 480, after: 240 }, children: [new TextRun({ text, bold: true, size: 32, font: 'Arial' })] }))
}
function addH2(text) {
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 360, after: 180 }, children: [new TextRun({ text, bold: true, size: 28, font: 'Arial' })] }))
}
function addH3(text) {
  children.push(new Paragraph({ heading: HeadingLevel.HEADING_3, spacing: { before: 240, after: 120 }, children: [new TextRun({ text, bold: true, size: 24, font: 'Arial' })] }))
}
function addP(text, bold, size, alignment, indent) {
  size = size || 24
  alignment = alignment || AlignmentType.JUSTIFIED
  bold = bold || false
  indent = indent || 0
  const p = new Paragraph({
    alignment,
    indent: indent ? { firstLine: indent * 360 } : undefined,
    spacing: { after: 120 },
    children: [new TextRun({ text, bold, size, font: 'Arial' })],
  })
  children.push(p)
}
function addBlank() { children.push(new Paragraph({ spacing: { after: 120 } })) }
function addPageBreak() { children.push(new Paragraph({ children: [new PageBreak()] })) }

// ── Cover page ──
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1800 }, children: [] }))
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 600 }, children: [new TextRun({ text: '本 科 毕 业 论 文', size: 28, bold: true, font: 'Arial' })] }))
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 480 }, children: [new TextRun({ text: '开 题 报 告', size: 40, bold: true, font: 'Arial' })] }))
children.push(new Paragraph({ spacing: { before: 960 }, children: [] }))
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 240 }, children: [new TextRun({ text: '基于Spring Boot与React的', size: 32, bold: true, font: 'Arial' })] }))
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [new TextRun({ text: '个人博客系统的设计与实现', size: 32, bold: true, font: 'Arial' })] }))
children.push(new Paragraph({ spacing: { before: 960 }, children: [] }))

// Cover info
const infoRows = [
  new TableRow({ children: [
    makeTableCell('专业：', false, {}),
    makeTableCell('计算机科学与技术', true, {}),
    makeTableCell('姓名：', false, {}),
    makeTableCell('（填写姓名）', true, {}),
  ]}),
  new TableRow({ children: [
    makeTableCell('学号：', false, {}),
    makeTableCell('（填写学号）', true, {}),
    makeTableCell('指导教师：', false, {}),
    makeTableCell('（填写教师名）', true, {}),
  ]}),
  new TableRow({ children: [
    makeTableCell('完成时间：', false, {}),
    makeTableCell('2026 年 7 月', true, {}),
    makeTableCell('', false, {}),
    makeTableCell('', false, {}),
  ]}),
]
children.push(makeTable(infoRows, [1800, 5670, 1800, 5670]))

children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200 }, children: [new TextRun({ text: '2026 年 7 月', size: 28, font: 'Arial' })] }))

addPageBreak()

// ── Content ──
addH1('一、选题背景与意义')
addH2('1.1 选题背景')
addP('随着Web技术的飞速发展和互联网内容的日益丰富，博客作为一种个人化信息发布与知识分享的平台，在技术交流、学习记录和思想表达等方面发挥着越来越重要的作用。从早期的WordPress、Blogger等传统博客平台，到如今注重个性化定制的各类内容管理系统，博客技术经历了从静态页面到动态渲染、从单体架构到前后端分离的持续演进。')
addP('在技术层面，现代Web应用开发已进入前后端分离的时代。前端框架如React、Vue等提供了丰富的组件化开发能力，而后端服务则通过RESTful API或GraphQL等方式提供数据支撑。这种架构模式不仅实现了前后端的解耦，还提升了系统的可维护性、可扩展性和团队协作效率。')
addP('在实际应用层面，大多数通用博客平台功能庞杂、定制化程度低，而完全自主搭建的博客系统又需要较高的技术门槛。因此，设计并实现一个功能适中、界面美观、易于使用的个人博客系统，既具有技术实践价值，也能满足个人用户的内容管理需求。')

addH2('1.2 研究意义')
addP('理论意义：本课题通过对前后端分离架构的实践，深入探讨Spring Boot与React技术在Web应用开发中的融合应用，验证分层架构设计在博客系统中的有效性与优势。同时，系统研究了基于JWT的身份认证机制、RBAC权限控制模型以及富文本编辑器在前端的应用方案，为同类Web应用的开发提供参考。', true)
addP('实践意义：')
addP('为用户提供一个完整的个人博客内容管理平台，支持文章的创作、编辑、审核、发布和展示全流程。')
addP('实现用户注册登录、个人中心、头像上传、密码管理、忘记密码等完善的用户功能。')
addP('提供分类管理、标签管理、评论互动等内容组织与社交功能。')
addP('构建管理员后台，支持数据统计、文章管理、评论审核、分类标签配置等功能。')
addP('采用现代化的UI设计，结合动画效果和玻璃拟态风格，提升用户体验。')

addPageBreak()

addH1('二、国内外研究现状')
addH2('2.1 国外研究现状')
addP('国外的博客平台发展较为成熟，代表性产品包括WordPress、Medium、Blogger和Ghost等。其中，WordPress是全球使用最广泛的博客和内容管理系统，截至2024年，全球超过40%的网站基于WordPress构建。它提供了丰富的插件生态和主题系统，支持高度定制化。Medium则专注于写作体验，以其简洁的界面和优质的社区内容著称。近年来，基于Jamstack架构的静态站点生成器（如Hugo、Gatsby、Next.js）也逐渐流行，它们通过将内容预构建为静态页面，配合CDN分发，实现了极佳的访问性能和安全性。')
addP('在技术架构方面，国外博客系统普遍采用了现代化的技术栈。前端多使用React、Vue或Svelte等组件化框架，后端则基于Node.js、Ruby on Rails、Django或Spring Boot等框架开发。数据库选型也更加多样化，除了传统的MySQL和PostgreSQL外，MongoDB等NoSQL数据库也被广泛应用于内容存储场景。')

addH2('2.2 国内研究现状')
addP('国内的博客平台以博客园（CSDN）、知乎专栏、简书和微信公众号为代表。CSDN是国内最大的开发者技术社区之一，提供了完善的技术文章发布和管理功能，支持Markdown编辑、代码高亮、分类标签等特性。微信公众号则依托庞大的用户基础，成为内容创作者的重要阵地，但其开放性和定制化程度相对较低。')
addP('在技术实现层面，国内高校毕业设计中的博客系统多采用SSM（Spring+Spring MVC+MyBatis）或Spring Boot作为后端框架，前端则使用Vue.js或React。近年来，随着微服务架构的兴起，部分系统也开始探索基于Spring Cloud的博客平台设计。')

addH2('2.3 发展趋势')
addP('综合国内外现状，博客系统的发展呈现以下趋势：')
addP('1. 架构现代化：前后端分离成为主流，RESTful API和GraphQL接口设计更加规范。')
addP('2. 安全强化：基于JWT的无状态认证、BCrypt密码加密、CORS跨域配置等安全措施被广泛应用。')
addP('3. 体验优化：富文本编辑器、Markdown支持、动画交互、响应式设计提升了用户创作和阅读体验。')
addP('4. 功能完善：内容审核机制、权限分级管理、数据统计分析等功能日趋完备。')

addPageBreak()

addH1('三、研究内容与目标')
addH2('3.1 研究内容')
addP('本课题设计并实现一个基于Spring Boot与React的个人博客管理系统，主要研究内容包括：')
addP('1. 前后端分离架构设计：采用RESTful API通信模式，后端提供统一的数据接口，前端通过Axios发起HTTP请求，实现前后端的完全解耦。')
addP('2. 用户认证与授权机制：基于Spring Security和JWT（JSON Web Token）实现无状态的身份认证，支持用户注册、登录、忘记密码、密码重置等功能。通过自定义JwtAuthenticationFilter拦截请求，验证Token有效性。系统采用RBAC模型区分普通用户和管理员权限。')
addP('3. 文章管理与内容审核：实现文章的创建、编辑、删除、查看等完整CRUD操作。用户提交的文章默认为"待审核"状态，管理员可在后台审核通过后发布。支持文章分类、标签关联、封面图设置、摘要编写等功能。')
addP('4. 评论互动系统：支持用户在文章详情页发表评论，评论采用树形结构（支持回复评论）。评论默认处于待审核状态，经管理员审核后可见。')
addP('5. 分类与标签管理：提供文章分类和标签的增删改查功能，支持文章与多个标签的多对多关联。')
addP('6. 管理员后台：为管理员提供数据统计面板（用户数、文章数、评论数、浏览量等）、文章管理（查看所有文章及审核状态）、评论管理（审核/删除评论）、分类标签管理等后台功能。')
addP('7. 前端UI/UX设计：采用Ant Design作为UI组件库，结合Framer Motion实现流畅的页面过渡动画。使用Tiptap作为富文本编辑器，支持Markdown风格的在线内容创作。集成粒子背景、光效、毛玻璃卡片等视觉特效，打造现代化的深色主题界面。')
addP('8. 数据库设计与优化：基于MySQL设计用户表、文章表、分类表、标签表、评论表等多张数据表，使用MyBatis-Plus作为ORM框架，实现高效的数据库操作。')

addH2('3.2 研究目标')
addP('1. 构建一个功能完整、稳定可靠的个人博客管理系统。')
addP('2. 实现用户从注册登录到文章创作、审核、发布的完整业务流程。')
addP('3. 提供美观直观的交互界面和良好的用户体验。')
addP('4. 确保系统的安全性，包括密码加密存储、Token认证、权限控制等。')
addP('5. 保证系统的可扩展性，便于后续功能的迭代和完善。')

addPageBreak()

addH1('四、技术路线与方案')
addH2('4.1 系统架构')
addP('系统采用前后端分离的双层架构，后端通过RESTful API提供数据服务，前端通过HTTP请求与后端通信，数据库层负责数据持久化存储。三层之间职责清晰，便于维护和扩展。')

addH2('4.2 前端技术栈')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('技术', true, { shade: 'E8E8E8' }), makeTableCell('版本', true, { shade: 'E8E8E8' }), makeTableCell('用途', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('React'), makeTableCell('19.x'), makeTableCell('前端框架，组件化开发')] }),
  new TableRow({ children: [makeTableCell('TypeScript'), makeTableCell('4.9+'), makeTableCell('类型安全的JavaScript超集')] }),
  new TableRow({ children: [makeTableCell('Vite'), makeTableCell('8.x'), makeTableCell('下一代前端构建工具')] }),
  new TableRow({ children: [makeTableCell('Ant Design'), makeTableCell('6.x'), makeTableCell('企业级UI组件库')] }),
  new TableRow({ children: [makeTableCell('React Router'), makeTableCell('6.x'), makeTableCell('客户端路由管理')] }),
  new TableRow({ children: [makeTableCell('Axios'), makeTableCell('1.x'), makeTableCell('HTTP请求库')] }),
  new TableRow({ children: [makeTableCell('Framer Motion'), makeTableCell('12.x'), makeTableCell('动画效果库')] }),
  new TableRow({ children: [makeTableCell('Tiptap'), makeTableCell('2.x'), makeTableCell('基于ProseMirror的富文本编辑器')] }),
  new TableRow({ children: [makeTableCell('Three.js / React Three Fiber'), makeTableCell('0.185.x'), makeTableCell('3D图形渲染（装饰性）')] }),
], [4000, 2000, 4000]))

addH2('4.3 后端技术栈')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('技术', true, { shade: 'E8E8E8' }), makeTableCell('版本', true, { shade: 'E8E8E8' }), makeTableCell('用途', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('Spring Boot'), makeTableCell('3.2.3'), makeTableCell('后端应用框架')] }),
  new TableRow({ children: [makeTableCell('Java'), makeTableCell('17'), makeTableCell('开发语言')] }),
  new TableRow({ children: [makeTableCell('MyBatis-Plus'), makeTableCell('3.5.5'), makeTableCell('ORM框架，简化数据库操作')] }),
  new TableRow({ children: [makeTableCell('Spring Security'), makeTableCell('6.x'), makeTableCell('安全认证与授权框架')] }),
  new TableRow({ children: [makeTableCell('JWT (jjwt)'), makeTableCell('0.12.5'), makeTableCell('JSON Web Token认证')] }),
  new TableRow({ children: [makeTableCell('MySQL Connector'), makeTableCell('8.x'), makeTableCell('数据库驱动')] }),
  new TableRow({ children: [makeTableCell('Lombok'), makeTableCell('-'), makeTableCell('简化Java代码')] }),
  new TableRow({ children: [makeTableCell('Hibernate Validator'), makeTableCell('-'), makeTableCell('参数校验')] }),
], [4000, 2000, 4000]))

addH2('4.4 数据库设计')
addP('系统使用MySQL 8.0数据库，设计了用户表、文章表、分类表、标签表、文章标签关联表和评论表等核心数据表，各表之间通过外键建立关联关系。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('表名', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' }), makeTableCell('关键字段', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('users'), makeTableCell('用户表'), makeTableCell('id, username, password, email, avatar, bio, role')] }),
  new TableRow({ children: [makeTableCell('articles'), makeTableCell('文章表'), makeTableCell('id, title, summary, content, cover_image, user_id, category_id, status, view_count')] }),
  new TableRow({ children: [makeTableCell('categories'), makeTableCell('分类表'), makeTableCell('id, name, description, sort_order')] }),
  new TableRow({ children: [makeTableCell('tags'), makeTableCell('标签表'), makeTableCell('id, name')] }),
  new TableRow({ children: [makeTableCell('article_tags'), makeTableCell('文章标签关联表'), makeTableCell('article_id, tag_id')] }),
  new TableRow({ children: [makeTableCell('comments'), makeTableCell('评论表'), makeTableCell('id, content, article_id, user_id, parent_id, status')] }),
], [2000, 2500, 5500]))

addH2('4.5 核心功能模块')
addP('系统共包含六大功能模块：')
addP('1. 认证模块：注册、登录、登出、JWT Token生成与验证、记住密码、忘记密码、密码重置')
addP('2. 用户模块：个人资料编辑、头像上传、密码修改、统计数据展示')
addP('3. 文章模块：文章列表（分页/搜索/筛选）、文章详情、文章创建/编辑/删除、我的投稿、文章审核')
addP('4. 分类标签模块：分类和标签的增删改查')
addP('5. 评论模块：发表评论、查看评论、评论审核')
addP('6. 管理后台模块：数据统计面板、文章管理、评论管理、分类标签管理')

addPageBreak()

addH1('五、系统可行性分析')
addH2('5.1 技术可行性')
addP('后端：Spring Boot作为业界成熟的Java Web框架，拥有完善的生态和社区支持。MyBatis-Plus进一步简化了数据库操作。Spring Security提供了企业级的安全认证方案。这些技术栈均经过大量生产环境验证，技术风险低。')
addP('前端：React是目前最流行的前端框架之一，配合TypeScript可以提供良好的类型安全和开发体验。Vite作为新一代构建工具，提供了快速的开发体验和优化的生产构建。Ant Design提供了丰富的企业级UI组件。')
addP('数据库：MySQL是广泛使用的关系型数据库，性能稳定，完全满足博客系统的存储需求。')
addP('整体：前后端通过RESTful API通信，采用JSON数据格式，接口设计规范，技术链路清晰。')

addH2('5.2 经济可行性')
addP('所有开发工具和技术栈均为开源免费软件，无需购买商业许可证。开发环境可在普通个人电脑上完成，硬件要求不高。部署成本低，可使用云服务器或本地服务器运行。')

addH2('5.3 操作可行性')
addP('系统界面采用现代化的深色主题设计，交互直观，符合用户使用习惯。普通用户只需注册登录后即可发布文章，操作流程简单明了。管理员后台提供清晰的数据统计和便捷的管理功能。系统内置了全局异常处理和友好的错误提示信息。')

addPageBreak()

addH1('六、论文结构与进度安排')
addH2('6.1 论文结构')
addP('本论文共分为七章，具体安排如下：')
addP('第一章 绪论：阐述课题的研究背景与意义，分析国内外博客系统的发展现状，说明研究内容和论文结构。')
addP('第二章 相关技术介绍：介绍系统开发所涉及的关键技术，包括Spring Boot、React、MySQL、JWT等。')
addP('第三章 系统需求分析：分析系统的功能性需求和非功能性需求，进行用例分析，明确系统要解决的问题。')
addP('第四章 系统设计：阐述系统的整体架构设计、功能模块划分、数据库设计和接口设计。')
addP('第五章 系统实现：详细描述核心功能模块的实现过程，展示关键代码和界面效果。')
addP('第六章 系统测试：制定测试方案，设计测试用例，记录测试结果，验证系统的正确性和稳定性。')
addP('第七章 总结与展望：总结本课题的工作成果，分析存在的不足，提出后续改进方向。')

addH2('6.2 进度安排')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('阶段', true, { shade: 'E8E8E8' }), makeTableCell('时间安排', true, { shade: 'E8E8E8' }), makeTableCell('主要任务', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('第一阶段'), makeTableCell('2026年3月-4月'), makeTableCell('确定选题，查阅文献，完成开题报告')] }),
  new TableRow({ children: [makeTableCell('第二阶段'), makeTableCell('2026年4月-5月上旬'), makeTableCell('需求分析，技术选型，系统架构设计')] }),
  new TableRow({ children: [makeTableCell('第三阶段'), makeTableCell('2026年5月上旬-5月下旬'), makeTableCell('数据库设计，前后端核心功能开发')] }),
  new TableRow({ children: [makeTableCell('第四阶段'), makeTableCell('2026年6月上旬'), makeTableCell('系统联调测试，界面优化，Bug修复')] }),
  new TableRow({ children: [makeTableCell('第五阶段'), makeTableCell('2026年6月中旬'), makeTableCell('撰写毕业论文，完成初稿')] }),
  new TableRow({ children: [makeTableCell('第六阶段'), makeTableCell('2026年6月下旬-7月上旬'), makeTableCell('论文修改完善，准备答辩')] }),
], [1800, 2800, 4500]))

addPageBreak()

addH1('七、预期成果')
addP('1. 一个功能完整的个人博客管理系统（前后端源码）。')
addP('2. 数据库设计文档和SQL脚本。')
addP('3. 系统部署说明文档。')
addP('4. 毕业论文一份。')

addPageBreak()

addH1('参考文献')
addP('[1] SPRING COMMUNITY. Spring Boot 3 reference guide[EB/OL]. (2024)[2026-07-12]. https://docs.spring.io/spring-boot/docs/current/reference/html/.')
addP('[2] WALLS C. Spring Boot in action[M]. 2nd ed. Shelter Island: Manning Publications, 2019.')
addP('[3] 王珊, 萨师煊. 数据库系统概论[M]. 5版. 北京: 高等教育出版社, 2014.')
addP('[4] IETF. RFC 7519: JSON web token (JWT)[S]. Redwood City: Internet Engineering Task Force, 2015.')
addP('[5] SPRING COMMUNITY. Spring Security reference guide: JWT authentication[EB/OL]. (2024)[2026-07-12]. https://docs.spring.io/spring-security/reference/servlet/authentication/jwt.html.')
addP('[6] CHINNATHAMBI K. Learning React: explicit lessons for modern React[M]. 7th ed. Sebastopol: O\'Reilly Media, 2024.')
addP('[7] MICROSOFT. TypeScript handbook[EB/OL]. (2024)[2026-07-12]. https://www.typescriptlang.org/docs/handbook/intro.html.')
addP('[8] ANT DESIGN. Ant Design design library[EB/OL]. (2024)[2026-07-12]. https://ant.design/.')
addP('[9] VITE COMMUNITY. Vite official guide[EB/OL]. (2024)[2026-07-12]. https://vitejs.dev/guide/.')
addP('[10] BAISE A, TAYLOR D. Designing data-intensive applications[M]. Sebastopol: O\'Reilly Media, 2017.')
addP('[11] 鲍宇. 基于Spring Boot的前后端分离架构设计与实现[J]. 电脑知识与技术, 2023, 19(12): 62-65.')
addP('[12] 黄文. MyBatis-Plus在Java持久层开发中的应用[J]. 软件导刊, 2023, 22(8): 88-92.')
addP('[13] FRAMER TECHNOLOGIES. Framer Motion documentation[EB/OL]. (2024)[2026-07-12]. https://www.framer.com/motion/.')
addP('[14] PROSEMIRROR. ProseMirror editor framework[EB/OL]. (2024)[2026-07-12]. https://prosemirror.net/.')

// ── Build ──
const doc = new Document({
  styles: {
    default: {
      document: { run: { font: 'Arial', size: 24 } },
    },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 32, bold: true, font: 'Arial', color: '000000' },
        paragraph: { spacing: { before: 480, after: 240 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: '000000' },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 24, bold: true, font: 'Arial', color: '000000' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 2 } },
    ],
  },
  sections: [{
    properties: {
      page: {
        width: 11906,
        height: 16838,
        margin: { top: 1440, right: 1270, bottom: 1440, left: 1270 },
      },
    },
    headers: {
      default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: '基于Spring Boot与React的个人博客系统的设计与实现 — 开题报告', size: 20, font: 'Arial', italic: true })] })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '第 ', size: 20, font: 'Arial' }), new TextRun({ children: [PageNumber.CURRENT], size: 20, font: 'Arial' }), new TextRun({ text: '页', size: 20, font: 'Arial' })] })] }),
    },
    children,
  }],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('开题报告_个人博客系统.docx', buffer)
  console.log('Done! File written.')
}).catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
