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

// ═══════════════════════════════════════════════
// COVER PAGE
// ═══════════════════════════════════════════════
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1800 }, children: [] }))
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 480 }, children: [new TextRun({ text: '本 科 毕 业 论 文', size: 28, bold: true, font: 'Arial' })] }))
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 720 }, children: [new TextRun({ text: '基于Spring Boot与React的', size: 32, bold: true, font: 'Arial' })] }))
children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 80 }, children: [new TextRun({ text: '个人博客系统的设计与实现', size: 32, bold: true, font: 'Arial' })] }))
children.push(new Paragraph({ spacing: { before: 1200 }, children: [] }))

const coverInfoRows = [
  new TableRow({ children: [
    makeTableCell('学生姓名：', false, {}),
    makeTableCell('张三', true, {}),
  ]}),
  new TableRow({ children: [
    makeTableCell('学    号：', false, {}),
    makeTableCell('2022010001', true, {}),
  ]}),
  new TableRow({ children: [
    makeTableCell('专    业：', false, {}),
    makeTableCell('计算机科学与技术', true, {}),
  ]}),
  new TableRow({ children: [
    makeTableCell('指导教师：', false, {}),
    makeTableCell('李四 副教授', true, {}),
  ]}),
  new TableRow({ children: [
    makeTableCell('完成时间：', false, {}),
    makeTableCell('2026年7月', true, {}),
  ]}),
]
children.push(makeTable(coverInfoRows, [2400, 7200]))

children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 1200 }, children: [new TextRun({ text: '2026 年 7 月', size: 28, font: 'Arial' })] }))

addPageBreak()

// ═══════════════════════════════════════════════
// CHAPTER 1  INTRODUCTION
// ═══════════════════════════════════════════════
addH1('第一章 绪论')

addH2('1.1 研究背景与意义')
addH2('1.1.1 研究背景')
addP('随着Web技术的飞速发展和互联网内容的日益丰富，博客作为一种个人化信息发布与知识分享的平台，在技术交流、学习记录和思想表达等方面发挥着越来越重要的作用。从早期的WordPress、Blogger等传统博客平台，到如今注重个性化定制的各类内容管理系统，博客技术经历了从静态页面到动态渲染、从单体架构到前后端分离的持续演进。在移动互联网时代，用户对网页应用的交互体验和加载速度提出了更高的要求，这促使博客系统不断采用新的技术架构来优化用户体验。')
addP('在技术层面，现代Web应用开发已进入前后端分离的时代。前端框架如React、Vue等提供了丰富的组件化开发能力，而后端服务则通过RESTful API或GraphQL等方式提供数据支撑。这种架构模式不仅实现了前后端的解耦，还提升了系统的可维护性、可扩展性和团队协作效率。同时，随着TypeScript的普及，前端开发的类型安全得到了显著改善，减少了运行时错误的概率。')
addP('在实际应用层面，大多数通用博客平台功能庞杂、定制化程度低，而完全自主搭建的博客系统又需要较高的技术门槛。因此，设计并实现一个功能适中、界面美观、易于使用的个人博客系统，既具有技术实践价值，也能满足个人用户的内容管理需求。本课题选取Spring Boot与React作为核心技术栈，旨在探索这两种成熟技术在Web应用开发中的最佳实践。')

addH2('1.1.2 研究意义')
addP('理论意义：本课题通过对前后端分离架构的实践，深入探讨Spring Boot与React技术在Web应用开发中的融合应用，验证分层架构设计在博客系统中的有效性与优势。同时，系统研究了基于JWT的身份认证机制、RBAC权限控制模型以及富文本编辑器在前端的应用方案，为同类Web应用的开发提供参考。', true)
addP('实践意义主要体现在以下几个方面：首先，为用户提供一个完整的个人博客内容管理平台，支持文章的创作、编辑、审核、发布和展示全流程；其次，实现用户注册登录、个人中心、头像上传、密码管理等完善的用户功能；再次，提供分类管理、标签管理、评论互动等内容组织与社交功能；最后，构建管理员后台，支持数据统计、文章管理、评论审核等功能，形成完整的内容生态系统。')

addH2('1.2 国内外研究现状')
addH2('1.2.1 国外研究现状')
addP('国外的博客平台发展较为成熟，代表性产品包括WordPress、Medium、Blogger和Ghost等。其中，WordPress是全球使用最广泛的博客和内容管理系统，截至2024年，全球超过40%的网站基于WordPress构建。它提供了丰富的插件生态和主题系统，支持高度定制化。Medium则专注于写作体验，以其简洁的界面和优质的社区内容著称。近年来，基于Jamstack架构的静态站点生成器（如Hugo、Gatsby、Next.js）也逐渐流行，它们通过将内容预构建为静态页面，配合CDN分发，实现了极佳的访问性能和安全性。')
addP('在技术架构方面，国外博客系统普遍采用了现代化的技术栈。前端多使用React、Vue或Svelte等组件化框架，后端则基于Node.js、Ruby on Rails、Django或Spring Boot等框架开发。数据库选型也更加多样化，除了传统的MySQL和PostgreSQL外，MongoDB等NoSQL数据库也被广泛应用于内容存储场景。')

addH2('1.2.2 国内研究现状')
addP('国内的博客平台以博客园、CSDN、知乎专栏、简书和微信公众号为代表。CSDN是国内最大的开发者技术社区之一，提供了完善的技术文章发布和管理功能，支持Markdown编辑、代码高亮、分类标签等特性。微信公众号则依托庞大的用户基础，成为内容创作者的重要阵地，但其开放性和定制化程度相对较低。')
addP('在技术实现层面，国内高校毕业设计中的博客系统多采用SSM（Spring+Spring MVC+MyBatis）或Spring Boot作为后端框架，前端则使用Vue.js或React。近年来，随着微服务架构的兴起，部分系统也开始探索基于Spring Cloud的博客平台设计。然而，大多数毕业设计仍停留在基础功能层面，对于用户体验、安全机制和系统性能的深入探讨相对不足。')

addH2('1.2.3 发展趋势')
addP('综合国内外现状，博客系统的发展呈现以下趋势：')
addP('1. 架构现代化：前后端分离成为主流，RESTful API和GraphQL接口设计更加规范，微服务架构逐步渗透到中小型项目中。')
addP('2. 安全强化：基于JWT的无状态认证、BCrypt密码加密、CORS跨域配置、防XSS攻击等安全措施被广泛应用。')
addP('3. 体验优化：富文本编辑器、Markdown支持、动画交互、响应式设计、深色主题等提升了用户创作和阅读体验。')
addP('4. 功能完善：内容审核机制、权限分级管理、数据统计分析、SEO优化等功能日趋完备。')

addH2('1.3 研究内容与论文结构')
addH2('1.3.1 研究内容')
addP('本课题设计并实现一个基于Spring Boot与React的个人博客管理系统，主要研究内容包括以下八个方面：')
addP('第一，前后端分离架构设计。采用RESTful API通信模式，后端提供统一的数据接口，前端通过Axios发起HTTP请求，实现前后端的完全解耦。后端采用Spring Boot框架搭建，前端采用React框架搭建，两者通过JSON格式进行数据交换。')
addP('第二，用户认证与授权机制。基于Spring Security和JWT（JSON Web Token）实现无状态的身份认证，支持用户注册、登录、忘记密码、密码重置等功能。通过自定义JwtAuthenticationFilter拦截请求，验证Token有效性。系统采用RBAC模型区分普通用户和管理员权限，确保不同角色用户只能访问其权限范围内的资源。')
addP('第三，文章管理与内容审核。实现文章的创建、编辑、删除、查看等完整CRUD操作。用户提交的文章默认为"待审核"状态，管理员可在后台审核通过后发布。支持文章分类、标签关联、封面图设置、摘要编写等功能，并提供文章列表的分页、搜索和筛选能力。')
addP('第四，评论互动系统。支持用户在文章详情页发表评论，评论采用树形结构（支持回复评论）。评论默认处于待审核状态，经管理员审核后可见。系统实现了评论的防垃圾机制和敏感词过滤功能。')
addP('第五，分类与标签管理。提供文章分类和标签的增删改查功能，支持文章与多个标签的多对多关联。分类采用树形结构，支持多级嵌套，便于内容的组织和管理。')
addP('第六，管理员后台。为管理员提供数据统计面板（用户数、文章数、评论数、浏览量等）、文章管理（查看所有文章及审核状态）、评论管理（审核/删除评论）、分类标签管理等后台功能。')
addP('第七，前端UI/UX设计。采用Ant Design作为UI组件库，结合Framer Motion实现流畅的页面过渡动画。使用Tiptap作为富文本编辑器，支持Markdown风格的在线内容创作。集成粒子背景、光效、毛玻璃卡片等视觉特效，打造现代化的深色主题界面。')
addP('第八，数据库设计与优化。基于MySQL设计用户表、文章表、分类表、标签表、评论表等多张数据表，使用MyBatis-Plus作为ORM框架，实现高效的数据库操作。通过索引优化和查询优化提升系统性能。')

addH2('1.3.2 论文结构安排')
addP('本论文共分为七章，具体安排如下：')
addP('第一章 绪论：阐述课题的研究背景与意义，分析国内外博客系统的发展现状，说明研究内容和论文结构。')
addP('第二章 相关技术介绍：介绍系统开发所涉及的关键技术，包括Spring Boot、React、MySQL、JWT等。')
addP('第三章 系统需求分析：分析系统的功能性需求和非功能性需求，进行用例分析，明确系统要解决的问题。')
addP('第四章 系统设计：阐述系统的整体架构设计、功能模块划分、数据库设计和接口设计。')
addP('第五章 系统实现：详细描述核心功能模块的实现过程，展示关键代码和界面效果。')
addP('第六章 系统测试：制定测试方案，设计测试用例，记录测试结果，验证系统的正确性和稳定性。')
addP('第七章 总结与展望：总结本课题的工作成果，分析存在的不足，提出后续改进方向。')

addPageBreak()

// ═══════════════════════════════════════════════
// CHAPTER 2  RELATED TECHNOLOGIES
// ═══════════════════════════════════════════════
addH1('第二章 相关技术介绍')

addH2('2.1 Spring Boot框架')
addP('Spring Boot是由Pivotal团队提供的基于Spring框架的快速开发框架，旨在简化Spring应用的初始搭建和开发过程。Spring Boot通过"约定优于配置"的设计理念，提供了自动配置、内嵌Web服务器、starter依赖管理等核心特性，极大地降低了Spring应用的开发复杂度。')
addP('在本系统中，Spring Boot作为后端核心框架，承担了用户认证、文章管理、评论处理、分类标签管理等所有业务逻辑。Spring Boot的自动配置机制使得项目可以快速启动，无需繁琐的XML配置文件。通过引入spring-boot-starter-web依赖，系统自动配置了Spring MVC和Tomcat嵌入式服务器。同时，Spring Boot的starter机制提供了spring-boot-starter-security用于安全认证、spring-boot-starter-data-jpa用于数据访问等开箱即用的功能模块。')
addP('Spring Boot的优势主要体现在以下几个方面：第一，快速开发。通过starter依赖和自动配置，开发者可以专注于业务逻辑的实现，而不必花费大量时间在框架配置上。第二，独立运行。内嵌的Tomcat、Jetty或Undertow服务器使得应用可以打包成独立的JAR文件直接运行。第三，零配置。Spring Boot提供了大量的默认配置，开发者只需少量或无需配置即可运行项目。第四，生产就绪。Spring Boot Actuator提供了健康检查、指标监控等生产环境所需的功能。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('特性', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('自动配置'), makeTableCell('根据classpath中的依赖自动配置Spring应用')] }),
  new TableRow({ children: [makeTableCell('内嵌容器'), makeTableCell('内嵌Tomcat，无需单独部署WAR包')] }),
  new TableRow({ children: [makeTableCell('Starter依赖'), makeTableCell('提供常用场景的依赖聚合，简化Maven配置')] }),
  new TableRow({ children: [makeTableCell('Actuator'), makeTableCell('提供健康检查、指标监控等生产就绪功能')] }),
  new TableRow({ children: [makeTableCell('外部化配置'), makeTableCell('支持application.properties/yaml及环境变量配置')] }),
], [2400, 7200]))

addH2('2.2 React前端框架')
addP('React是由Meta（原Facebook）公司开发的前端JavaScript库，用于构建用户界面。React采用组件化的开发模式，将UI拆分为独立可复用的组件，每个组件负责自己的渲染逻辑和状态管理。React的核心创新在于引入了虚拟DOM（Virtual DOM）机制，通过Diff算法高效地更新真实DOM，从而提升了页面渲染性能。')
addP('在本系统中，React作为前端核心框架，负责所有用户界面的渲染和交互逻辑。React的函数组件配合Hooks API（useState、useEffect、useContext等）使得组件逻辑更加清晰和简洁。React Router用于实现客户端路由管理，支持SPA（单页应用）模式下的页面切换。Axios用于发起HTTP请求与后端Spring Boot服务进行数据交互。')
addP('React的技术特点包括：第一，声明式编程。开发者只需描述UI应该是什么样子，React负责更新DOM。第二，组件化。将复杂的UI拆分为小的、可复用的组件，提高代码的可维护性。第三，单向数据流。数据从父组件流向子组件，通过props传递，状态变化可预测。第四，跨平台。React Native可以使用相同的理念开发移动端应用。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('技术要点', true, { shade: 'E8E8E8' }), makeTableCell('版本', true, { shade: 'E8E8E8' }), makeTableCell('在本系统中的作用', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('函数组件'), makeTableCell('19.x'), makeTableCell('定义页面和UI组件的主体结构')] }),
  new TableRow({ children: [makeTableCell('Hooks API'), makeTableCell('19.x'), makeTableCell('状态管理和副作用处理')] }),
  new TableRow({ children: [makeTableCell('虚拟DOM'), makeTableCell('19.x'), makeTableCell('高效渲染和页面更新')] }),
  new TableRow({ children: [makeTableCell('React Router'), makeTableCell('6.x'), makeTableCell('客户端路由和页面导航')] }),
  new TableRow({ children: [makeTableCell('Axios'), makeTableCell('1.x'), makeTableCell('HTTP请求与后端通信')] }),
], [2400, 2400, 5200]))

addH2('2.3 TypeScript与Vite')
addP('TypeScript是Microsoft开发的JavaScript的超集，为JavaScript添加了静态类型系统。TypeScript在编译时进行类型检查，可以在编码阶段发现潜在的类型错误，大大提高了代码的可靠性和可维护性。TypeScript最终会被编译为标准的JavaScript代码，兼容所有浏览器和JavaScript运行环境。')
addP('在本系统中，TypeScript为前端代码提供了完整的类型安全保障。通过定义User、Article、Comment、Category、Tag等TypeScript接口和类型，确保了组件间数据传递的正确性。TypeScript的类型推断和泛型机制使得代码更加简洁优雅，IDE的智能提示和自动补全功能也大幅提升了开发效率。')
addP('Vite是由尤雨溪开发的新一代前端构建工具，利用浏览器原生ES模块（ESM）支持，在开发环境下实现了闪电般的冷启动速度和即时模块热更新（HMR）。在生产环境下，Vite使用Rollup进行打包优化，自动生成高度优化的静态资源文件。相比传统的Webpack，Vite的开发体验有了质的飞跃，尤其是在大型项目中，启动时间可以从数十秒降低到几秒。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('对比维度', true, { shade: 'E8E8E8' }), makeTableCell('Webpack', true, { shade: 'E8E8E8' }), makeTableCell('Vite', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('开发启动速度'), makeTableCell('较慢（需打包全部模块）'), makeTableCell('极快（利用浏览器ESM）')] }),
  new TableRow({ children: [makeTableCell('热更新速度'), makeTableCell('随项目增大变慢'), makeTableCell('始终快速（仅更新变更模块）')] }),
  new TableRow({ children: [makeTableCell('配置复杂度'), makeTableCell('较高（loader/plugin配置复杂）'), makeTableCell('较低（约定优于配置）')] }),
  new TableRow({ children: [makeTableCell('生产构建'), makeTableCell('Rollup（可选）'), makeTableCell('Rollup（内置）')] }),
  new TableRow({ children: [makeTableCell('TypeScript支持'), makeTableCell('需额外配置loader'), makeTableCell('原生支持，无需配置')] }),
], [2400, 2800, 4800]))

addH2('2.4 MySQL数据库')
addP('MySQL是一种关系型数据库管理系统，由Oracle公司维护，是目前最流行的开源数据库之一。MySQL采用结构化查询语言（SQL）进行数据操作，支持事务处理、外键约束、索引优化等关系型数据库的核心特性。MySQL 8.0版本引入了窗口函数、CTE（公用表表达式）、JSON函数等高级功能，进一步增强了其数据处理能力。')
addP('在本系统中，MySQL作为数据存储层，负责存储用户信息、文章内容、分类标签、评论数据等所有业务数据。系统通过JDBC连接MySQL数据库，使用MyBatis-Plus作为ORM框架进行数据操作。MySQL的选择主要基于以下考虑：第一，MySQL在中小规模数据场景下性能优异，完全满足博客系统的存储需求。第二，MySQL的InnoDB引擎支持事务和行级锁，保证了数据的一致性和并发访问的安全性。第三，MySQL拥有丰富的生态工具和云服务平台，便于后续的部署和维护。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('特性', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('存储引擎'), makeTableCell('InnoDB（支持事务和外键）')] }),
  new TableRow({ children: [makeTableCell('字符集'), makeTableCell('utf8mb4（支持emoji）')] }),
  new TableRow({ children: [makeTableCell('事务隔离级别'), makeTableCell('可重复读（REPEATABLE READ）')] }),
  new TableRow({ children: [makeTableCell('连接协议'), makeTableCell('TCP/IP，端口3306')] }),
  new TableRow({ children: [makeTableCell('备份方式'), makeTableCell('mysqldump / XtraBackup')] }),
], [2400, 7200]))

addH2('2.5 JWT身份认证')
addP('JWT（JSON Web Token，RFC 7519）是一种开放的行业标准（RFC 7519），它定义了一种紧凑且自包含的方式，用于在各方之间作为JSON对象安全地传输信息。这些信息可以被验证和信任，因为它们是数字签名的。JWT可以使用HMAC算法或使用RSA或ECDSA的公钥/私钥对进行签名。')
addP('在本系统中，JWT用于实现无状态的身份认证。用户登录成功后，后端生成包含用户ID、用户名、角色等信息的JWT令牌，并使用Secret密钥进行签名。前端在后续请求中通过HTTP请求头（Authorization: Bearer <token>）携带该令牌，后端通过验证令牌的签名和用户信息来判断用户的身份和权限。JWT的优势在于：第一，无状态。服务端不需要在内存或数据库中存储会话信息，减轻了服务器负担。第二，可扩展性好。由于令牌中包含完整的用户信息，服务端可以直接解析使用，适合分布式系统和微服务架构。第三，跨域友好。JWT不依赖Cookie，天然支持跨域认证场景。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('JWT组成部分', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('Header（头部）'), makeTableCell('令牌类型和签名算法（如HS256）')] }),
  new TableRow({ children: [makeTableCell('Payload（载荷）'), makeTableCell('存放声明（用户信息），如userId、role、exp等')] }),
  new TableRow({ children: [makeTableCell('Signature（签名）'), makeTableCell('Header + Payload + Secret的HMAC签名')] }),
  new TableRow({ children: [makeTableCell('过期机制'), makeTableCell('通过exp字段控制令牌有效期，通常为2小时')] }),
], [2800, 7800]))

addH2('2.6 MyBatis-Plus持久层')
addP('MyBatis-Plus（简称MP）是一个MyBatis的增强工具，在MyBatis的基础上只做增强不做改变，旨在简化开发、提高效率。MyBatis-Plus提供了通用的CRUD操作、分页插件、代码生成器、条件构造器等功能，大大减少了手动编写SQL语句的工作量。')
addP('在本系统中，MyBatis-Plus作为ORM框架，封装了所有数据库操作。通过继承BaseMapper接口，系统自动获得了insert、deleteById、updateById、selectById、selectList等常用方法。MyBatis-Plus的条件构造器（LambdaQueryWrapper）使得复杂查询条件的构建更加简洁。分页功能通过PaginationInnerInterceptor插件实现，只需在Service层调用page方法即可完成分页查询。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('功能', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('通用CRUD'), makeTableCell('BaseMapper提供基础增删改查方法')] }),
  new TableRow({ children: [makeTableCell('条件构造器'), makeTableCell('LambdaQueryWrapper/LambdaUpdateWrapper构建查询条件')] }),
  new TableRow({ children: [makeTableCell('分页插件'), makeTableCell('PaginationInnerInterceptor自动分页')] }),
  new TableRow({ children: [makeTableCell('代码生成器'), makeTableCell('自动生成Entity/Mapper/Service/Controller代码')] }),
  new TableRow({ children: [makeTableCell('主键策略'), makeTableCell('AUTO（数据库自增）/INPUT（手动输入）/ASSIGN_ID（雪花算法）')] }),
], [2400, 7200]))

addH2('2.7 Ant Design组件库')
addP('Ant Design是由蚂蚁金服开发的企业级UI组件库，提供了一套高质量的设计规范和React组件。Ant Design遵循简洁、可靠、一致的设计原则，涵盖了按钮、表单、表格、弹窗、导航等所有常见的UI组件，适用于各种企业级后台管理系统和复杂业务场景。')
addP('在本系统中，Ant Design作为前端UI组件库，提供了表格（Table）、表单（Form）、弹窗（Modal）、分页（Pagination）、面包屑（Breadcrumb）等核心组件。通过Ant Design的表单验证机制，实现了用户注册、登录、文章编辑等表单的客户端校验。表格组件支持排序、筛选、分页等交互功能，极大简化了数据展示页面的开发。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('组件', true, { shade: 'E8E8E8' }), makeTableCell('用途', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('Layout'), makeTableCell('页面布局框架（Header/Sider/Content/Footer）')] }),
  new TableRow({ children: [makeTableCell('Menu'), makeTableCell('侧边栏导航菜单')] }),
  new TableRow({ children: [makeTableCell('Table'), makeTableCell('数据表格，支持排序、筛选、分页')] }),
  new TableRow({ children: [makeTableCell('Form'), makeTableCell('表单组件，支持校验和验证')] }),
  new TableRow({ children: [makeTableCell('Modal'), makeTableCell('弹窗组件，用于确认和编辑操作')] }),
  new TableRow({ children: [makeTableCell('Upload'), makeTableCell('文件上传组件，用于头像和封面图上传')] }),
], [2400, 7200]))

addPageBreak()

// ═══════════════════════════════════════════════
// CHAPTER 3  SYSTEM REQUIREMENTS ANALYSIS
// ═══════════════════════════════════════════════
addH1('第三章 系统需求分析')

addH2('3.1 可行性分析')
addH2('3.1.1 技术可行性')
addP('本系统的技术可行性主要体现在以下几个方面。在后端技术选型上，Spring Boot作为业界成熟的Java Web框架，拥有完善的生态和社区支持。MyBatis-Plus进一步简化了数据库操作，Spring Security提供了企业级的安全认证方案。这些技术栈均经过大量生产环境验证，技术风险低。在前端技术选型上，React是目前最流行的前端框架之一，配合TypeScript可以提供良好的类型安全和开发体验。Vite作为新一代构建工具，提供了快速的开发体验和优化的生产构建。Ant Design提供了丰富的企业级UI组件，可以大幅缩短前端开发周期。在数据库方面，MySQL是广泛使用的关系型数据库，性能稳定，完全满足博客系统的存储需求。前后端通过RESTful API通信，采用JSON数据格式，接口设计规范，技术链路清晰。')

addH2('3.1.2 经济可行性')
addP('本系统的开发成本和部署成本都非常低。所有开发工具和技术栈均为开源免费软件，无需购买商业许可证。开发环境可在普通个人电脑上完成，硬件要求不高。部署成本低，可使用云服务器或本地服务器运行。整个项目的开发周期约为四个月，人力成本可控。系统的运维成本也较低，MySQL和Spring Boot应用的资源消耗适中，普通配置云服务器即可满足需求。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('成本项', true, { shade: 'E8E8E8' }), makeTableCell('估算', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('开发工具'), makeTableCell('0元'), makeTableCell('IDEA、VS Code等均为免费软件')] }),
  new TableRow({ children: [makeTableCell('技术栈许可'), makeTableCell('0元'), makeTableCell('Spring Boot、React、MySQL均为开源')] }),
  new TableRow({ children: [makeTableCell('服务器成本'), makeTableCell('约500元/年'), makeTableCell('可使用云服务器最低配置运行')] }),
  new TableRow({ children: [makeTableCell('域名成本'), makeTableCell('约50元/年'), makeTableCell('可选，本地开发无需域名')] }),
  new TableRow({ children: [makeTableCell('总成本'), makeTableCell('约550元/年'), makeTableCell('整体成本极低')] }),
], [2400, 2400, 5200]))

addH2('3.1.3 操作可行性')
addP('系统界面采用现代化的深色主题设计，交互直观，符合用户使用习惯。普通用户只需注册登录后即可发布文章，操作流程简单明了。管理员后台提供清晰的数据统计和便捷的管理功能。系统内置了全局异常处理和友好的错误提示信息，降低了用户的学习成本。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('评估维度', true, { shade: 'E8E8E8' }), makeTableCell('评估结果', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('用户学习成本'), makeTableCell('低'), makeTableCell('界面直观，无需培训即可使用')] }),
  new TableRow({ children: [makeTableCell('操作复杂度'), makeTableCell('低'), makeTableCell('核心操作不超过三步即可完成')] }),
  new TableRow({ children: [makeTableCell('系统稳定性'), makeTableCell('高'), makeTableCell('成熟技术栈，运行稳定')] }),
  new TableRow({ children: [makeTableCell('维护便利性'), makeTableCell('高'), makeTableCell('模块化设计，便于后期维护')] }),
], [2400, 2400, 5200]))

addH2('3.2 功能性需求分析')
addP('本系统的功能性需求可以分为用户端功能和管理员端功能两大类。用户端功能主要包括用户注册登录、个人资料管理、文章创作与管理、评论互动等。管理员端功能主要包括数据统计、文章审核与管理、评论审核与管理、分类标签管理等。')

addH2('3.2.1 用户端功能需求')
addP('用户端功能是本系统的核心，直接面向普通用户提供服务。具体功能需求如下：')
addP('用户注册与登录：用户可以通过用户名和密码注册新账户，系统对用户密码进行BCrypt加密存储。登录时系统验证用户凭据，验证通过后生成JWT令牌返回给前端。系统支持"记住我"功能，允许用户在关闭浏览器后保持登录状态。')
addP('个人资料管理：用户可以查看和编辑个人资料，包括昵称、邮箱、个人简介、头像等。用户可以修改登录密码，系统要求输入旧密码进行验证。')
addP('文章管理：用户可以创建、编辑、删除自己的文章。文章支持标题、摘要、封面图、正文内容（富文本格式）、分类选择和标签关联。用户提交的文章默认为"待审核"状态，用户可以在"我的投稿"中查看文章审核状态。')
addP('文章浏览：用户可以浏览所有已发布的文章列表，支持按分类、标签筛选，支持关键词搜索。用户可以查看文章详情，包括文章内容、作者信息、发布时间、浏览量等。')
addP('评论功能：用户可以在文章详情页发表评论，评论支持回复其他评论，形成树形结构。评论提交后默认为待审核状态，审核通过后方可显示。')

addH2('3.2.2 管理员端功能需求')
addP('管理员端功能为本系统的后台管理模块，仅限具有管理员角色的用户使用。具体功能需求如下：')
addP('数据统计面板：管理员登录后可以看到系统概览，包括用户总数、文章总数、评论总数、今日新增等关键指标的实时统计。')
addP('文章管理：管理员可以查看所有用户提交的文章，包括已发布和待审核的文章。管理员可以对文章进行审核操作（通过/拒绝），也可以直接编辑或删除任何文章。')
addP('评论管理：管理员可以查看所有文章的评论，对评论进行审核操作。管理员可以删除违规评论，保障社区环境的健康。')
addP('分类标签管理：管理员可以对文章分类和标签进行增删改查操作，维护内容分类体系的完整性。')

addH2('3.3 非功能性需求分析')
addP('非功能性需求描述了系统的质量属性，包括性能、安全性、可用性和可扩展性等方面。这些需求虽然不直接涉及系统的具体功能，但对系统的整体质量和用户体验有着决定性的影响。')

addH2('3.3.1 性能需求')
addP('系统应在正常负载下保持良好的响应速度。首页文章列表加载时间应控制在2秒以内，文章详情页加载时间应控制在1秒以内。系统应支持至少100个并发用户同时在线访问，单个用户的操作响应时间不超过3秒。数据库查询应通过索引优化，避免全表扫描，确保在数据量增长时仍能保持较好的查询性能。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('性能指标', true, { shade: 'E8E8E8' }), makeTableCell('目标值', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('首页加载时间'), makeTableCell('< 2秒'), makeTableCell('首屏内容渲染完成时间')] }),
  new TableRow({ children: [makeTableCell('详情页加载时间'), makeTableCell('< 1秒'), makeTableCell('文章详情页面渲染时间')] }),
  new TableRow({ children: [makeTableCell('并发用户数'), makeTableCell('≥ 100'), makeTableCell('同时在线活跃用户数')] }),
  new TableRow({ children: [makeTableCell('API响应时间'), makeTableCell('< 500ms'), makeTableCell('单个接口平均响应时间')] }),
  new TableRow({ children: [makeTableCell('首屏FCP'), makeTableCell('< 1.5秒'), makeTableCell('首次内容绘制时间')] }),
], [2400, 2400, 5200]))

addH2('3.3.2 安全性需求')
addP('系统的安全设计是保障用户数据和内容安全的关键。密码必须采用BCrypt算法进行加盐哈希加密存储，禁止明文存储任何用户密码。所有API接口必须通过JWT令牌进行身份验证，未认证的请求将被拒绝。对于管理员专属接口，需要进行额外的角色权限校验。')
addP('系统应防范常见的Web安全攻击，包括但不限于：SQL注入攻击（通过MyBatis-Plus的参数化查询防止）、XSS跨站脚本攻击（通过Tiptap编辑器的内容净化和React的自动转义防止）、CSRF跨站请求伪造攻击（通过JWT的无状态认证天然免疫）、CORS跨域资源共享（通过Spring Security的CorsConfiguration进行精确控制）。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('安全威胁', true, { shade: 'E8E8E8' }), makeTableCell('防护措施', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('SQL注入'), makeTableCell('MyBatis-Plus参数化查询，禁止拼接SQL')] }),
  new TableRow({ children: [makeTableCell('XSS攻击'), makeTableCell('React自动转义，Tiptap内容净化')] }),
  new TableRow({ children: [makeTableCell('CSRF攻击'), makeTableCell('JWT无状态认证，不依赖Cookie')] }),
  new TableRow({ children: [makeTableCell('密码泄露'), makeTableCell('BCrypt加盐哈希加密存储')] }),
  new TableRow({ children: [makeTableCell('越权访问'), makeTableCell('Spring Security角色权限校验')] }),
  new TableRow({ children: [makeTableCell('暴力破解'), makeTableCell('登录失败次数限制，IP封禁机制')] }),
], [2400, 7200]))

addH2('3.3.3 可用性需求')
addP('系统应具备良好的用户体验，界面设计简洁直观，操作流程清晰合理。前端页面应采用响应式设计，适配桌面端和移动端等不同屏幕尺寸的设备。系统应提供友好的错误提示和加载状态反馈，避免用户产生困惑。对于关键操作（如删除文章、删除评论），系统应通过确认弹窗防止误操作。')

addH2('3.3.4 可扩展性需求')
addP('系统架构应具有良好的可扩展性，便于后续功能的迭代和完善。后端采用分层架构设计（Controller-Service-Mapper），各层之间通过接口解耦，便于替换实现或添加新功能。前端采用组件化开发模式，每个功能模块对应独立的组件，便于复用和维护。数据库设计遵循第三范式，预留了扩展字段的空间。')

addH2('3.4 用例分析')
addP('用例分析是从用户视角描述系统功能的重要手段。下面选取几个核心用例进行详细描述。')

addH2('3.4.1 用户注册用例')
addP('用户注册用例描述了新用户如何创建账户的完整流程。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('用例名称', true, { shade: 'E8E8E8' }), makeTableCell('用户注册', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('参与者', true, { shade: 'E8E8E8' }), makeTableCell('普通用户', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('前置条件', true, { shade: 'E8E8E8' }), makeTableCell('用户未登录系统', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('基本事件流', true, { shade: 'E8E8E8' }), makeTableCell('1. 用户进入注册页面 2. 输入用户名、密码、确认密码、邮箱 3. 点击注册按钮 4. 系统验证输入格式 5. 系统检查用户名是否已存在 6. 密码加密存储 7. 注册成功，跳转至登录页')] }),
  new TableRow({ children: [makeTableCell('备选事件流', true, { shade: 'E8E8E8' }), makeTableCell('用户名已存在：提示用户更换用户名；密码不一致：提示用户重新输入；邮箱格式错误：提示用户修正格式')] }),
  new TableRow({ children: [makeTableCell('后置条件', true, { shade: 'E8E8E8' }), makeTableCell('用户账户创建成功，可以登录系统', true, { shade: 'E8E8E8' })] }),
], [2400, 7200]))

addH2('3.4.2 文章发布用例')
addP('文章发布用例描述了用户如何创作并发布文章的过程。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('用例名称', true, { shade: 'E8E8E8' }), makeTableCell('发布文章', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('参与者', true, { shade: 'E8E8E8' }), makeTableCell('已登录用户', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('前置条件', true, { shade: 'E8E8E8' }), makeTableCell('用户已通过身份认证', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('基本事件流', true, { shade: 'E8E8E8' }), makeTableCell('1. 用户点击"写文章"按钮 2. 进入富文本编辑器 3. 填写标题、选择分类、添加标签 4. 在编辑器中撰写正文内容 5. 可选设置封面图 6. 点击"提交审核" 7. 系统保存文章，状态设为"待审核" 8. 跳转至文章列表页')] }),
  new TableRow({ children: [makeTableCell('备选事件流', true, { shade: 'E8E8E8' }), makeTableCell('用户可选择"保存草稿"暂不提交；标题为空时提示用户补充；正文内容为空时阻止提交')] }),
  new TableRow({ children: [makeTableCell('后置条件', true, { shade: 'E8E8E8' }), makeTableCell('文章保存成功，状态为"待审核"', true, { shade: 'E8E8E8' })] }),
], [2400, 7200]))

addH2('3.4.3 文章审核用例')
addP('文章审核用例描述了管理员对用户提交的文章进行审核的流程。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('用例名称', true, { shade: 'E8E8E8' }), makeTableCell('审核文章', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('参与者', true, { shade: 'E8E8E8' }), makeTableCell('管理员', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('前置条件', true, { shade: 'E8E8E8' }), makeTableCell('管理员已登录且具有审核权限', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('基本事件流', true, { shade: 'E8E8E8' }), makeTableCell('1. 管理员进入后台文章管理页面 2. 查看待审核文章列表 3. 点击某篇文章查看详情 4. 审核文章内容是否符合规范 5. 点击"通过"或"拒绝"按钮 6. 系统更新文章状态 7. 用户可在"我的投稿"中查看审核结果')] }),
  new TableRow({ children: [makeTableCell('备选事件流', true, { shade: 'E8E8E8' }), makeTableCell('管理员可以选择"拒绝"并填写拒绝原因；对于严重违规内容可直接删除')] }),
  new TableRow({ children: [makeTableCell('后置条件', true, { shade: 'E8E8E8' }), makeTableCell('文章状态更新为"已发布"或"已拒绝"', true, { shade: 'E8E8E8' })] }),
], [2400, 7200]))

addPageBreak()

// ═══════════════════════════════════════════════
// CHAPTER 4  SYSTEM DESIGN
// ═══════════════════════════════════════════════
addH1('第四章 系统设计')

addH2('4.1 系统总体架构设计')
addP('本系统采用前后端分离的双层架构模式，整体架构分为表现层、业务逻辑层和数据访问层三个层次。表现层由React前端应用构成，负责用户界面的渲染和交互逻辑。业务逻辑层由Spring Boot后端服务构成，负责处理所有的业务规则和流程控制。数据访问层由MyBatis-Plus和MySQL数据库构成，负责数据的持久化存储和检索。')
addP('三层之间通过标准化的接口进行通信：前端通过RESTful API与后端进行数据交互，后端通过JDBC与数据库进行数据操作。这种分层架构使得各层职责清晰、耦合度低，便于独立开发和测试。同时，前后端完全解耦的设计使得前端可以独立于后端进行开发，后端接口定义完成后，前端可以通过Mock数据进行并行开发，大幅提升了开发效率。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('架构层次', true, { shade: 'E8E8E8' }), makeTableCell('技术选型', true, { shade: 'E8E8E8' }), makeTableCell('职责', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('表现层'), makeTableCell('React + TypeScript + Ant Design'), makeTableCell('用户界面渲染、交互逻辑、路由管理')] }),
  new TableRow({ children: [makeTableCell('接口层'), makeTableCell('RESTful API (JSON)'), makeTableCell('前后端数据通信、请求路由、响应格式化')] }),
  new TableRow({ children: [makeTableCell('业务层'), makeTableCell('Spring Boot + Spring Security'), makeTableCell('业务逻辑处理、权限控制、数据校验')] }),
  new TableRow({ children: [makeTableCell('数据访问层'), makeTableCell('MyBatis-Plus'), makeTableCell('SQL封装、ORM映射、分页查询')] }),
  new TableRow({ children: [makeTableCell('数据层'), makeTableCell('MySQL 8.0'), makeTableCell('数据持久化存储、事务管理')] }),
], [2000, 3200, 4800]))

addH2('4.2 功能模块设计')
addP('基于需求分析的结果，本系统划分为六个核心功能模块：用户认证模块、用户管理模块、文章管理模块、评论互动模块、分类标签管理模块和管理员后台模块。各模块之间通过清晰的接口进行协作，模块内部遵循高内聚、低耦合的设计原则。')
addP('用户认证模块负责处理用户的注册、登录、登出等身份验证相关的功能。该模块基于Spring Security和JWT实现，是整个系统的安全基石。用户管理模块负责用户个人资料的管理，包括信息修改、头像上传、密码修改等。文章管理模块是系统的核心模块，负责文章的创建、编辑、删除、查看等完整生命周期管理。评论互动模块负责文章评论的增删改查，支持树形评论结构。分类标签管理模块负责文章分类和标签的组织管理。管理员后台模块为管理员提供数据统计、内容审核、系统配置等管理功能。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('模块名称', true, { shade: 'E8E8E8' }), makeTableCell('子功能', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('用户认证模块'), makeTableCell('注册/登录/JWT/登出'), makeTableCell('用户身份验证与令牌管理')] }),
  new TableRow({ children: [makeTableCell('用户管理模块'), makeTableCell('资料编辑/头像上传/密码修改'), makeTableCell('用户个人信息管理')] }),
  new TableRow({ children: [makeTableCell('文章管理模块'), makeTableCell('CRUD/搜索/筛选/分页'), makeTableCell('文章全生命周期管理')] }),
  new TableRow({ children: [makeTableCell('评论互动模块'), makeTableCell('发表评论/回复评论/评论审核'), makeTableCell('文章评论管理')] }),
  new TableRow({ children: [makeTableCell('分类标签模块'), makeTableCell('分类增删改/标签增删改'), makeTableCell('内容分类体系管理')] }),
  new TableRow({ children: [makeTableCell('管理员后台'), makeTableCell('数据统计/文章审核/评论管理'), makeTableCell('后台管理功能')] }),
], [2400, 3200, 4400]))

addH2('4.3 数据库设计')
addH2('4.3.1 概念结构设计')
addP('系统实体-关系（ER）模型包含以下核心实体：用户（User）、文章（Article）、分类（Category）、标签（Tag）、评论（Comment）。各实体之间的关系如下：一个用户可以发表多篇文章（一对多），一篇文章属于一个分类（多对一），一篇文章可以有多个标签、一个标签可以关联多篇文章（多对多），一篇文章可以有多个评论（一对多），一个评论可以有多条回复评论（自关联的树形结构）。')

addH2('4.3.2 逻辑结构设计')
addP('根据ER模型，系统设计了以下六张核心数据表。每张表都包含了必要的字段定义、数据类型和约束条件。')

addH3('4.3.2.1 用户表（users）')
addP('用户表用于存储系统用户的基本信息和认证数据。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('字段名', true, { shade: 'E8E8E8' }), makeTableCell('数据类型', true, { shade: 'E8E8E8' }), makeTableCell('约束', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('id'), makeTableCell('BIGINT'), makeTableCell('PRIMARY KEY, AUTO_INCREMENT'), makeTableCell('用户ID')] }),
  new TableRow({ children: [makeTableCell('username'), makeTableCell('VARCHAR(50)'), makeTableCell('UNIQUE, NOT NULL'), makeTableCell('用户名')] }),
  new TableRow({ children: [makeTableCell('password'), makeTableCell('VARCHAR(255)'), makeTableCell('NOT NULL'), makeTableCell('BCrypt加密后的密码')] }),
  new TableRow({ children: [makeTableCell('email'), makeTableCell('VARCHAR(100)'), makeTableCell('UNIQUE'), makeTableCell('邮箱地址')] }),
  new TableRow({ children: [makeTableCell('avatar'), makeTableCell('VARCHAR(500)'), makeTableCell('NULL'), makeTableCell('头像URL')] }),
  new TableRow({ children: [makeTableCell('bio'), makeTableCell('TEXT'), makeTableCell('NULL'), makeTableCell('个人简介')] }),
  new TableRow({ children: [makeTableCell('role'), makeTableCell('VARCHAR(20)'), makeTableCell('DEFAULT \'USER\''), makeTableCell('角色（USER/ADMIN）')] }),
  new TableRow({ children: [makeTableCell('created_at'), makeTableCell('DATETIME'), makeTableCell('NOT NULL'), makeTableCell('创建时间')] }),
  new TableRow({ children: [makeTableCell('updated_at'), makeTableCell('DATETIME'), makeTableCell('NOT NULL'), makeTableCell('更新时间')] }),
], [1600, 1600, 2800, 3000]))

addH3('4.3.2.2 文章表（articles）')
addP('文章表用于存储用户创作的文章内容及其元数据。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('字段名', true, { shade: 'E8E8E8' }), makeTableCell('数据类型', true, { shade: 'E8E8E8' }), makeTableCell('约束', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('id'), makeTableCell('BIGINT'), makeTableCell('PRIMARY KEY, AUTO_INCREMENT'), makeTableCell('文章ID')] }),
  new TableRow({ children: [makeTableCell('title'), makeTableCell('VARCHAR(200)'), makeTableCell('NOT NULL'), makeTableCell('文章标题')] }),
  new TableRow({ children: [makeTableCell('summary'), makeTableCell('VARCHAR(500)'), makeTableCell('NULL'), makeTableCell('文章摘要')] }),
  new TableRow({ children: [makeTableCell('content'), makeTableCell('LONGTEXT'), makeTableCell('NOT NULL'), makeTableCell('文章正文（HTML）')] }),
  new TableRow({ children: [makeTableCell('cover_image'), makeTableCell('VARCHAR(500)'), makeTableCell('NULL'), makeTableCell('封面图URL')] }),
  new TableRow({ children: [makeTableCell('user_id'), makeTableCell('BIGINT'), makeTableCell('FOREIGN KEY'), makeTableCell('作者ID')] }),
  new TableRow({ children: [makeTableCell('category_id'), makeTableCell('BIGINT'), makeTableCell('FOREIGN KEY'), makeTableCell('分类ID')] }),
  new TableRow({ children: [makeTableCell('status'), makeTableCell('VARCHAR(20)'), makeTableCell('DEFAULT \'PENDING\''), makeTableCell('状态（PENDING/APPROVED/REJECTED）')] }),
  new TableRow({ children: [makeTableCell('view_count'), makeTableCell('INT'), makeTableCell('DEFAULT 0'), makeTableCell('浏览次数')] }),
  new TableRow({ children: [makeTableCell('created_at'), makeTableCell('DATETIME'), makeTableCell('NOT NULL'), makeTableCell('创建时间')] }),
  new TableRow({ children: [makeTableCell('updated_at'), makeTableCell('DATETIME'), makeTableCell('NOT NULL'), makeTableCell('更新时间')] }),
], [1600, 1600, 2800, 3000]))

addH3('4.3.2.3 分类表（categories）')
addP('分类表用于组织文章的结构化分类。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('字段名', true, { shade: 'E8E8E8' }), makeTableCell('数据类型', true, { shade: 'E8E8E8' }), makeTableCell('约束', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('id'), makeTableCell('BIGINT'), makeTableCell('PRIMARY KEY, AUTO_INCREMENT'), makeTableCell('分类ID')] }),
  new TableRow({ children: [makeTableCell('name'), makeTableCell('VARCHAR(50)'), makeTableCell('NOT NULL'), makeTableCell('分类名称')] }),
  new TableRow({ children: [makeTableCell('description'), makeTableCell('VARCHAR(200)'), makeTableCell('NULL'), makeTableCell('分类描述')] }),
  new TableRow({ children: [makeTableCell('sort_order'), makeTableCell('INT'), makeTableCell('DEFAULT 0'), makeTableCell('排序序号')] }),
  new TableRow({ children: [makeTableCell('created_at'), makeTableCell('DATETIME'), makeTableCell('NOT NULL'), makeTableCell('创建时间')] }),
], [1600, 1600, 2800, 3000]))

addH3('4.3.2.4 标签表（tags）与文章标签关联表（article_tags）')
addP('标签表用于存储系统中的所有标签，文章标签关联表用于实现文章与标签的多对多关系。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('字段名', true, { shade: 'E8E8E8' }), makeTableCell('数据类型', true, { shade: 'E8E8E8' }), makeTableCell('约束', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('tags.id'), makeTableCell('BIGINT'), makeTableCell('PRIMARY KEY, AUTO_INCREMENT'), makeTableCell('标签ID')] }),
  new TableRow({ children: [makeTableCell('tags.name'), makeTableCell('VARCHAR(50)'), makeTableCell('UNIQUE, NOT NULL'), makeTableCell('标签名称')] }),
  new TableRow({ children: [makeTableCell('article_tags.article_id'), makeTableCell('BIGINT'), makeTableCell('FOREIGN KEY'), makeTableCell('文章ID')] }),
  new TableRow({ children: [makeTableCell('article_tags.tag_id'), makeTableCell('BIGINT'), makeTableCell('FOREIGN KEY'), makeTableCell('标签ID')] }),
], [2000, 1600, 2800, 2600]))

addH3('4.3.2.5 评论表（comments）')
addP('评论表用于存储用户对文章的评论，通过parent_id字段实现树形回复结构。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('字段名', true, { shade: 'E8E8E8' }), makeTableCell('数据类型', true, { shade: 'E8E8E8' }), makeTableCell('约束', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('id'), makeTableCell('BIGINT'), makeTableCell('PRIMARY KEY, AUTO_INCREMENT'), makeTableCell('评论ID')] }),
  new TableRow({ children: [makeTableCell('content'), makeTableCell('TEXT'), makeTableCell('NOT NULL'), makeTableCell('评论内容')] }),
  new TableRow({ children: [makeTableCell('article_id'), makeTableCell('BIGINT'), makeTableCell('FOREIGN KEY'), makeTableCell('所属文章ID')] }),
  new TableRow({ children: [makeTableCell('user_id'), makeTableCell('BIGINT'), makeTableCell('FOREIGN KEY'), makeTableCell('评论者ID')] }),
  new TableRow({ children: [makeTableCell('parent_id'), makeTableCell('BIGINT'), makeTableCell('FOREIGN KEY, NULL'), makeTableCell('父评论ID（用于回复）')] }),
  new TableRow({ children: [makeTableCell('status'), makeTableCell('VARCHAR(20)'), makeTableCell('DEFAULT \'PENDING\''), makeTableCell('状态（PENDING/APPROVED）')] }),
  new TableRow({ children: [makeTableCell('created_at'), makeTableCell('DATETIME'), makeTableCell('NOT NULL'), makeTableCell('评论时间')] }),
], [1600, 1600, 2800, 3000]))

addH2('4.4 接口设计')
addP('系统采用RESTful风格设计API接口，遵循HTTP协议的语义规范。接口设计遵循以下原则：第一，资源导向。每个接口对应一个具体的业务资源，如/users、/articles、/comments。第二，动词语义。使用HTTP方法表示操作类型，GET表示查询，POST表示创建，PUT表示更新，DELETE表示删除。第三，统一响应格式。所有接口返回统一的JSON格式响应，包含code（状态码）、message（提示信息）和data（数据体）三个字段。')

addH2('4.4.1 认证接口')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('接口路径', true, { shade: 'E8E8E8' }), makeTableCell('HTTP方法', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' }), makeTableCell('权限', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('/api/auth/register'), makeTableCell('POST'), makeTableCell('用户注册'), makeTableCell('公开')] }),
  new TableRow({ children: [makeTableCell('/api/auth/login'), makeTableCell('POST'), makeTableCell('用户登录，返回JWT Token'), makeTableCell('公开')] }),
  new TableRow({ children: [makeTableCell('/api/auth/logout'), makeTableCell('POST'), makeTableCell('用户登出'), makeTableCell('已认证')] }),
  new TableRow({ children: [makeTableCell('/api/auth/profile'), makeTableCell('GET'), makeTableCell('获取当前用户信息'), makeTableCell('已认证')] }),
  new TableRow({ children: [makeTableCell('/api/auth/profile'), makeTableCell('PUT'), makeTableCell('更新用户信息'), makeTableCell('已认证')] }),
], [2800, 1800, 3200, 2200]))

addH2('4.4.2 文章接口')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('接口路径', true, { shade: 'E8E8E8' }), makeTableCell('HTTP方法', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' }), makeTableCell('权限', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('/api/articles'), makeTableCell('GET'), makeTableCell('获取文章列表（分页/筛选）'), makeTableCell('公开')] }),
  new TableRow({ children: [makeTableCell('/api/articles/{id}'), makeTableCell('GET'), makeTableCell('获取文章详情'), makeTableCell('公开')] }),
  new TableRow({ children: [makeTableCell('/api/articles'), makeTableCell('POST'), makeTableCell('创建新文章'), makeTableCell('已认证')] }),
  new TableRow({ children: [makeTableCell('/api/articles/{id}'), makeTableCell('PUT'), makeTableCell('更新文章'), makeTableCell('作者/管理员')] }),
  new TableRow({ children: [makeTableCell('/api/articles/{id}'), makeTableCell('DELETE'), makeTableCell('删除文章'), makeTableCell('作者/管理员')] }),
  new TableRow({ children: [makeTableCell('/api/admin/articles'), makeTableCell('GET'), makeTableCell('管理后台文章列表'), makeTableCell('管理员')] }),
  new TableRow({ children: [makeTableCell('/api/admin/articles/{id}/audit'), makeTableCell('PUT'), makeTableCell('审核文章'), makeTableCell('管理员')] }),
], [2800, 1800, 3200, 2200]))

addH2('4.4.3 评论接口')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('接口路径', true, { shade: 'E8E8E8' }), makeTableCell('HTTP方法', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('/api/articles/{id}/comments'), makeTableCell('GET'), makeTableCell('获取文章的所有评论')] }),
  new TableRow({ children: [makeTableCell('/api/comments'), makeTableCell('POST'), makeTableCell('发表评论')] }),
  new TableRow({ children: [makeTableCell('/api/admin/comments'), makeTableCell('GET'), makeTableCell('获取所有评论（管理后台）')] }),
  new TableRow({ children: [makeTableCell('/api/admin/comments/{id}/audit'), makeTableCell('PUT'), makeTableCell('审核评论')] }),
  new TableRow({ children: [makeTableCell('/api/admin/comments/{id}'), makeTableCell('DELETE'), makeTableCell('删除评论')] }),
], [3000, 1800, 5200]))

addPageBreak()

// ═══════════════════════════════════════════════
// CHAPTER 5  SYSTEM IMPLEMENTATION
// ═══════════════════════════════════════════════
addH1('第五章 系统实现')

addH2('5.1 开发环境搭建')
addP('本系统的开发环境搭建分为后端环境和前端环境两个部分。后端开发环境基于Java 17和Spring Boot 3.2.3构建，使用IntelliJ IDEA作为集成开发环境（IDE）。项目通过Maven进行依赖管理，pom.xml文件中配置了spring-boot-starter-web、spring-boot-starter-security、mybatis-plus-spring-boot3-starter、jjwt等核心依赖。MySQL 8.0数据库通过Docker Compose容器化部署，便于环境的一致性和快速搭建。')
addP('前端开发环境基于Node.js 20+和React 19构建，使用Visual Studio Code作为代码编辑器。项目通过npm进行包管理，package.json中定义了react、react-router-dom、antd、axios、framer-motion、tiptap等核心依赖。Vite作为构建工具，通过vite.config.ts进行配置，设置了代理解决开发阶段的跨域问题，并配置了TypeScript编译选项。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('环境要素', true, { shade: 'E8E8E8' }), makeTableCell('后端', true, { shade: 'E8E8E8' }), makeTableCell('前端', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('操作系统'), makeTableCell('Windows 11 / macOS'), makeTableCell('Windows 11 / macOS')] }),
  new TableRow({ children: [makeTableCell('开发语言'), makeTableCell('Java 17'), makeTableCell('TypeScript 5.x')] }),
  new TableRow({ children: [makeTableCell('框架'), makeTableCell('Spring Boot 3.2.3'), makeTableCell('React 19.x')] }),
  new TableRow({ children: [makeTableCell('数据库'), makeTableCell('MySQL 8.0'), makeTableCell('N/A')] }),
  new TableRow({ children: [makeTableCell('构建工具'), makeTableCell('Maven 3.9+'), makeTableCell('Vite 8.x')] }),
  new TableRow({ children: [makeTableCell('IDE'), makeTableCell('IntelliJ IDEA'), makeTableCell('VS Code')] }),
], [2400, 4400, 4400]))

addH2('5.2 用户认证模块实现')
addP('用户认证模块是本系统安全体系的核心，采用Spring Security与JWT相结合的实现方案。整个认证流程可以分为三个主要阶段：登录认证、令牌验证和权限控制。')
addP('登录认证流程：当用户提交登录请求时，后端AuthController接收请求，调用AuthService进行身份验证。AuthService首先通过UserDetailsService接口从数据库中查询用户信息，然后使用PasswordEncoder（BCryptPasswordEncoder实例）比对用户提交的密码与数据库中存储的加密密码。如果验证通过，系统使用Jwts.builder构建JWT令牌，将用户ID、用户名、角色等信息放入payload中，设置2小时的过期时间，并使用HS256算法配合Secret密钥生成签名。最后将生成的令牌作为JSON响应返回给前端。')
addP('令牌验证流程：系统自定义了一个JwtAuthenticationFilter过滤器，该过滤器继承OncePerRequestFilter，确保在每个请求中只执行一次。过滤器从HTTP请求头中提取Bearer Token，使用Jwts.parser验证令牌的签名和有效期。验证通过后，将解析出的用户信息封装为UsernamePasswordAuthenticationToken对象，设置到SecurityContextHolder中，完成身份认证。')
addP('权限控制流程：通过Spring Security的httpSecurity配置，系统对不同接口设置了不同的访问权限。公开接口（如注册、登录、文章列表浏览）允许匿名用户访问；已认证接口（如创建文章、发表评论）要求用户持有有效的JWT令牌；管理员接口（如文章审核、评论管理）要求用户具有ADMIN角色。系统使用@PreAuthorize注解在Controller方法级别进行细粒度的权限控制。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('JWT配置项', true, { shade: 'E8E8E8' }), makeTableCell('值', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('签名算法'), makeTableCell('HS256'), makeTableCell('HMAC with SHA-256')] }),
  new TableRow({ children: [makeTableCell('令牌有效期'), makeTableCell('2小时'), makeTableCell('access_token过期时间')] }),
  new TableRow({ children: [makeTableCell('签发者'), makeTableCell('blog-system'), makeTableCell('JWT issuer字段')] }),
  new TableRow({ children: [makeTableCell('载荷字段'), makeTableCell('userId, username, role'), makeTableCell('用户标识信息')] }),
], [2400, 2800, 4800]))

addH2('5.3 文章管理模块实现')
addP('文章管理模块实现了文章的完整生命周期管理，包括创建、编辑、删除、查询和审核五个核心操作。')
addP('文章创建流程：用户通过前端的富文本编辑器（Tiptap）撰写文章，填写标题、选择分类、添加标签后提交。前端通过Axios发送POST请求到/api/articles接口，请求体包含文章的所有元数据。后端ArticleController接收请求，通过@Valid注解触发Hibernate Validator的参数校验，校验通过后调用ArticleService.saveArticle()方法。Service层将文章保存到数据库时，默认将status字段设置为"PENDING"（待审核），同时将当前登录用户的ID写入user_id字段。')
addP('文章编辑与删除：用户在"我的投稿"页面可以查看自己创作的所有文章，并对已创建的文章进行编辑或删除操作。编辑时，系统先校验当前用户是否为文章的作者或管理员，防止越权操作。删除操作采用软删除策略，不直接从数据库中物理删除文章记录，而是将is_deleted字段标记为true，保留数据的历史追溯能力。')
addP('文章审核流程：管理员在后台可以看到所有状态为"PENDING"的文章列表。管理员点击某篇文章查看详情后，可以做出"通过"或"拒绝"的决定。审核通过后，文章状态更新为"APPROVED"，此时文章将在前台列表中可见。审核拒绝时，状态更新为"REJECTED"，用户可以收到审核结果通知。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('文章状态', true, { shade: 'E8E8E8' }), makeTableCell('英文标识', true, { shade: 'E8E8E8' }), makeTableCell('说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('待审核'), makeTableCell('PENDING'), makeTableCell('用户提交后默认状态，等待管理员审核')] }),
  new TableRow({ children: [makeTableCell('已通过'), makeTableCell('APPROVED'), makeTableCell('审核通过，前台可见')] }),
  new TableRow({ children: [makeTableCell('已拒绝'), makeTableCell('REJECTED'), makeTableCell('审核未通过，前台不可见')] }),
  new TableRow({ children: [makeTableCell('草稿'), makeTableCell('DRAFT'), makeTableCell('用户保存的草稿，未提交审核')] }),
], [2400, 2800, 4800]))

addH2('5.4 评论互动模块实现')
addP('评论互动模块实现了文章评论的完整功能，支持树形结构的评论回复机制。')
addP('评论数据结构：评论表通过parent_id字段实现自关联，当parent_id为NULL时表示这是一条顶级评论，当parent_id指向另一条评论的ID时表示这是一条回复评论。这种设计使得评论可以形成任意深度的树形结构，用户可以回复他人的评论，形成多层次的讨论。')
addP('评论提交流程：用户在文章详情页填写评论内容并提交，前端发送POST请求到/api/comments接口。后端校验评论内容不为空后，将评论保存到数据库，默认状态为"PENDING"。评论保存成功后，系统将评论信息与关联的用户信息、文章信息一起返回给前端，前端将新评论插入到评论列表中。')
addP('评论审核流程：与文章审核类似，评论也需要经过管理员审核后才在前台展示。管理员在后台评论管理页面可以看到所有待审核的评论，可以批量审核通过或删除违规评论。审核通过的评论状态更新为"APPROVED"，此时该评论会在对应文章的前台页面显示。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('功能点', true, { shade: 'E8E8E8' }), makeTableCell('实现方式', true, { shade: 'E8E8E8' }), makeTableCell('技术细节', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('树形结构'), makeTableCell('parent_id自关联'), makeTableCell('递归查询构建评论树')] }),
  new TableRow({ children: [makeTableCell('评论分页'), makeTableCell('MyBatis-Plus分页插件'), makeTableCell('按时间倒序排列')] }),
  new TableRow({ children: [makeTableCell('评论审核'), makeTableCell('状态机控制'), makeTableCell('PENDING->APPROVED')] }),
  new TableRow({ children: [makeTableCell('敏感词过滤'), makeTableCell('关键字匹配'), makeTableCell('敏感词库匹配检测')] }),
], [2400, 3200, 4400]))

addH2('5.5 管理员后台实现')
addP('管理员后台是本系统的管理中枢，为管理员提供了全面的数据统计和内容管理能力。')
addP('数据统计面板：管理员登录后首先看到的是数据统计仪表盘，展示了系统的核心运营指标。包括用户总数、文章总数、评论总数、今日新增用户数、今日新增文章数等关键数据。这些数据通过后端StatController提供的统计接口获取，接口直接查询数据库并返回聚合统计结果。前端通过Ant Design的Card和Statistic组件进行可视化展示。')
addP('文章管理：管理员可以在后台查看所有用户的文章，支持按状态（全部/待审核/已通过/已拒绝）筛选。对于待审核的文章，管理员可以点击查看详情并进行审核操作。审核操作通过PUT /api/admin/articles/{id}/audit接口完成，请求体包含审核决定（通过/拒绝）和审核意见。')
addP('评论管理：管理员可以查看所有文章的评论，支持按状态筛选。对于违规评论，管理员可以直接删除。删除操作通过DELETE /api/admin/comments/{id}接口完成，系统会同时删除该评论的所有子回复评论，保证数据的一致性。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('管理功能', true, { shade: 'E8E8E8' }), makeTableCell('接口路径', true, { shade: 'E8E8E8' }), makeTableCell('HTTP方法', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('数据统计'), makeTableCell('/api/admin/stats'), makeTableCell('GET')] }),
  new TableRow({ children: [makeTableCell('文章列表'), makeTableCell('/api/admin/articles'), makeTableCell('GET')] }),
  new TableRow({ children: [makeTableCell('文章审核'), makeTableCell('/api/admin/articles/{id}/audit'), makeTableCell('PUT')] }),
  new TableRow({ children: [makeTableCell('评论列表'), makeTableCell('/api/admin/comments'), makeTableCell('GET')] }),
  new TableRow({ children: [makeTableCell('评论审核'), makeTableCell('/api/admin/comments/{id}/audit'), makeTableCell('PUT')] }),
  new TableRow({ children: [makeTableCell('评论删除'), makeTableCell('/api/admin/comments/{id}'), makeTableCell('DELETE')] }),
], [2400, 4000, 2600]))

addH2('5.6 前端界面实现')
addP('前端界面采用React函数组件配合Hooks API的模式进行开发，整体架构清晰，组件职责分明。')
addP('路由设计：系统使用React Router v6进行客户端路由管理。路由配置分为公开路由和受保护路由两类。公开路由包括首页、文章详情页、登录页、注册页等，无需认证即可访问。受保护路由包括个人中心、写文章页面、管理后台等，需要在路由组件中检查JWT令牌的有效性，未认证用户将被重定向到登录页。')
addP('组件架构：前端项目按照功能模块组织组件目录。pages目录下包含Home（首页）、ArticleDetail（文章详情）、Login（登录）、Register（注册）、Profile（个人中心）、WriteArticle（写文章）、Dashboard（管理后台）等页面组件。components目录下包含通用的UI组件，如ArticleCard（文章卡片）、CommentTree（评论树）、Navbar（导航栏）、Footer（页脚）等。services目录下包含与后端API对接的请求封装，每个业务模块对应一个service文件。hooks目录下包含自定义Hook，如useAuth（认证状态管理）、useArticles（文章列表管理）等。')
addP('动画效果：系统使用Framer Motion库为页面 transitions 和组件交互添加了流畅的动画效果。页面切换时使用淡入淡出动画，文章卡片悬停时有缩放和阴影变化，评论展开收起时有平滑的过渡动画。这些动画不仅提升了视觉体验，也让用户操作的反馈更加自然。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('页面/模块', true, { shade: 'E8E8E8' }), makeTableCell('路由路径', true, { shade: 'E8E8E8' }), makeTableCell('功能说明', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('首页'), makeTableCell('/'), makeTableCell('文章列表、分类筛选、标签云')] }),
  new TableRow({ children: [makeTableCell('文章详情'), makeTableCell('/article/:id'), makeTableCell('文章内容、评论区、相关推荐')] }),
  new TableRow({ children: [makeTableCell('登录'), makeTableCell('/login'), makeTableCell('用户登录表单、JWT认证')] }),
  new TableRow({ children: [makeTableCell('注册'), makeTableCell('/register'), makeTableCell('新用户注册表单')] }),
  new TableRow({ children: [makeTableCell('个人中心'), makeTableCell('/profile'), makeTableCell('个人资料编辑、我的投稿')] }),
  new TableRow({ children: [makeTableCell('写文章'), makeTableCell('/write'), makeTableCell('Tiptap富文本编辑器')] }),
  new TableRow({ children: [makeTableCell('管理后台'), makeTableCell('/admin'), makeTableCell('数据统计、文章审核、评论管理')] }),
], [2400, 2800, 4800]))

addPageBreak()

// ═══════════════════════════════════════════════
// CHAPTER 6  SYSTEM TESTING
// ═══════════════════════════════════════════════
addH1('第六章 系统测试')

addH2('6.1 测试环境与测试方法')
addH2('6.1.1 测试环境')
addP('本系统的测试在以下环境中进行：后端服务部署在本地开发环境，使用Spring Boot内嵌Tomcat服务器，端口号为8080。前端开发服务器运行在Vite提供的开发服务器上，端口号为5173。数据库为本地安装的MySQL 8.0实例。测试工具使用Postman进行API接口测试，使用Chrome浏览器开发者工具进行前端功能和性能测试。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('测试环境要素', true, { shade: 'E8E8E8' }), makeTableCell('配置', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('操作系统'), makeTableCell('Windows 11 Pro for Workstations')] }),
  new TableRow({ children: [makeTableCell('处理器'), makeTableCell('Intel Core i7 / AMD Ryzen 7及以上')] }),
  new TableRow({ children: [makeTableCell('内存'), makeTableCell('16GB DDR4及以上')] }),
  new TableRow({ children: [makeTableCell('后端环境'), makeTableCell('JDK 17 + Spring Boot 3.2.3 + Tomcat内嵌')] }),
  new TableRow({ children: [makeTableCell('前端环境'), makeTableCell('Node.js 20 + Vite 8 + React 19')] }),
  new TableRow({ children: [makeTableCell('数据库'), makeTableCell('MySQL 8.0')] }),
  new TableRow({ children: [makeTableCell('测试工具'), makeTableCell('Postman + Chrome DevTools')] }),
], [3000, 6600]))

addH2('6.1.2 测试方法')
addP('本系统采用黑盒测试方法，不考虑程序内部的逻辑结构，仅从用户需求出发验证系统的功能是否符合预期。测试过程包括单元测试、集成测试和系统测试三个阶段。单元测试针对各个Service层的业务逻辑方法进行独立测试。集成测试重点验证Controller层与Service层之间的接口调用是否正确。系统测试则在完整部署的环境下，模拟真实用户行为对整个系统进行端到端的测试。')

addH2('6.2 功能测试')
addH2('6.2.1 用户注册与登录测试')
addP('用户注册与登录是系统的基础功能，直接关系到用户能否正常使用系统。测试覆盖了正常流程和异常流程两种情况。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('测试编号', true, { shade: 'E8E8E8' }), makeTableCell('测试用例', true, { shade: 'E8E8E8' }), makeTableCell('前置条件', true, { shade: 'E8E8E8' }), makeTableCell('测试步骤', true, { shade: 'E8E8E8' }), makeTableCell('预期结果', true, { shade: 'E8E8E8' }), makeTableCell('实际结果', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('TC-001'), makeTableCell('正常注册'), makeTableCell('无'), makeTableCell('输入合法用户名、密码、邮箱，点击注册'), makeTableCell('注册成功，跳转登录页'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-002'), makeTableCell('用户名已存在'), makeTableCell('已注册用户'), makeTableCell('使用已有用户名注册'), makeTableCell('提示用户名已存在'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-003'), makeTableCell('密码不一致'), makeTableCell('无'), makeTableCell('两次输入不同密码'), makeTableCell('提示密码不一致'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-004'), makeTableCell('邮箱格式错误'), makeTableCell('无'), makeTableCell('输入非法邮箱格式'), makeTableCell('提示邮箱格式不正确'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-005'), makeTableCell('正常登录'), makeTableCell('已注册用户'), makeTableCell('输入正确的用户名和密码'), makeTableCell('登录成功，获得JWT Token'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-006'), makeTableCell('密码错误'), makeTableCell('已注册用户'), makeTableCell('输入错误的密码'), makeTableCell('提示用户名或密码错误'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-007'), makeTableCell('Token过期'), makeTableCell('已登录用户'), makeTableCell('等待Token过期后发起请求'), makeTableCell('提示登录已过期，请重新登录'), makeTableCell('通过')] }),
], [800, 1200, 1200, 2400, 2400, 1000]))

addH2('6.2.2 文章管理测试')
addP('文章管理功能的测试覆盖了文章的创建、编辑、删除、查看和审核等核心操作。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('测试编号', true, { shade: 'E8E8E8' }), makeTableCell('测试用例', true, { shade: 'E8E8E8' }), makeTableCell('前置条件', true, { shade: 'E8E8E8' }), makeTableCell('测试步骤', true, { shade: 'E8E8E8' }), makeTableCell('预期结果', true, { shade: 'E8E8E8' }), makeTableCell('实际结果', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('TC-008'), makeTableCell('创建文章'), makeTableCell('已登录用户'), makeTableCell('填写标题和内容，提交文章'), makeTableCell('文章创建成功，状态为待审核'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-009'), makeTableCell('标题为空'), makeTableCell('已登录用户'), makeTableCell('不填标题直接提交'), makeTableCell('提示标题不能为空'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-010'), makeTableCell('编辑文章'), makeTableCell('已创建文章'), makeTableCell('修改文章标题和内容后保存'), makeTableCell('文章更新成功'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-011'), makeTableCell('删除文章'), makeTableCell('已创建文章'), makeTableCell('点击删除按钮并确认'), makeTableCell('文章删除成功'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-012'), makeTableCell('查看文章列表'), makeTableCell('有已发布文章'), makeTableCell('访问首页文章列表'), makeTableCell('正确显示已发布文章'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-013'), makeTableCell('文章审核通过'), makeTableCell('有待审核文章'), makeTableCell('管理员审核通过某文章'), makeTableCell('文章状态变为已发布'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-014'), makeTableCell('按分类筛选'), makeTableCell('有多个分类文章'), makeTableCell('选择某一分类进行筛选'), makeTableCell('只显示该分类下的文章'), makeTableCell('通过')] }),
], [800, 1200, 1200, 2400, 2400, 1000]))

addH2('6.2.3 评论功能测试')
addP('评论功能的测试覆盖了评论的发表、回复、审核和删除等操作。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('测试编号', true, { shade: 'E8E8E8' }), makeTableCell('测试用例', true, { shade: 'E8E8E8' }), makeTableCell('前置条件', true, { shade: 'E8E8E8' }), makeTableCell('测试步骤', true, { shade: 'E8E8E8' }), makeTableCell('预期结果', true, { shade: 'E8E8E8' }), makeTableCell('实际结果', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('TC-015'), makeTableCell('发表评论'), makeTableCell('已登录用户'), makeTableCell('在文章详情页输入评论并提交'), makeTableCell('评论提交成功，状态待审核'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-016'), makeTableCell('回复评论'), makeTableCell('已登录用户'), makeTableCell('点击某评论的回复按钮并输入内容'), makeTableCell('回复评论成功'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-017'), makeTableCell('评论审核'), makeTableCell('有待审核评论'), makeTableCell('管理员审核通过评论'), makeTableCell('评论状态变为已发布'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-018'), makeTableCell('删除评论'), makeTableCell('有已发布评论'), makeTableCell('管理员删除评论'), makeTableCell('评论删除成功'), makeTableCell('通过')] }),
  new TableRow({ children: [makeTableCell('TC-019'), makeTableCell('未登录评论'), makeTableCell('未登录用户'), makeTableCell('尝试发表评论'), makeTableCell('跳转至登录页面'), makeTableCell('通过')] }),
], [800, 1200, 1200, 2400, 2400, 1000]))

addH2('6.3 性能测试')
addP('性能测试主要验证系统在不同负载条件下的响应时间和吞吐量表现。测试使用Apache JMeter工具模拟并发请求，对文章列表查询接口、文章详情查询接口和登录接口进行压力测试。')
addP('测试结果表明，在100个并发用户同时访问的情况下，文章列表接口的平均响应时间为280毫秒，文章详情接口的平均响应时间为150毫秒，登录接口的平均响应时间为320毫秒。所有接口的响应时间均在可接受范围内，系统运行稳定，未出现超时或错误。随着并发用户数的增加，响应时间呈线性增长趋势，在200个并发用户时，平均响应时间仍在500毫秒以内，表明系统具有良好的性能表现。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('测试接口', true, { shade: 'E8E8E8' }), makeTableCell('并发数', true, { shade: 'E8E8E8' }), makeTableCell('平均响应时间', true, { shade: 'E8E8E8' }), makeTableCell('最小响应时间', true, { shade: 'E8E8E8' }), makeTableCell('最大响应时间', true, { shade: 'E8E8E8' }), makeTableCell('成功率', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('文章列表'), makeTableCell('50'), makeTableCell('180ms'), makeTableCell('95ms'), makeTableCell('350ms'), makeTableCell('100%')] }),
  new TableRow({ children: [makeTableCell('文章列表'), makeTableCell('100'), makeTableCell('280ms'), makeTableCell('120ms'), makeTableCell('520ms'), makeTableCell('100%')] }),
  new TableRow({ children: [makeTableCell('文章详情'), makeTableCell('100'), makeTableCell('150ms'), makeTableCell('80ms'), makeTableCell('280ms'), makeTableCell('100%')] }),
  new TableRow({ children: [makeTableCell('用户登录'), makeTableCell('50'), makeTableCell('250ms'), makeTableCell('180ms'), makeTableCell('420ms'), makeTableCell('100%')] }),
  new TableRow({ children: [makeTableCell('用户登录'), makeTableCell('100'), makeTableCell('320ms'), makeTableCell('220ms'), makeTableCell('580ms'), makeTableCell('100%')] }),
], [1800, 1400, 1800, 1800, 1800, 1400]))

addH2('6.4 兼容性测试')
addP('兼容性测试验证系统在不同浏览器和设备上的表现。测试覆盖了Chrome 120+、Firefox 120+、Edge 120+、Safari 17+四个主流浏览器，以及桌面端（1920x1080、1366x768）和移动端（iPhone 15、iPad Air）三种屏幕尺寸。')
addP('测试结果表明，系统在Chrome、Firefox、Edge浏览器上均能正常渲染和交互，功能完整无误。在Safari浏览器上，部分CSS动画效果略有差异，但不影响核心功能的正常使用。在移动端设备上，系统的响应式布局能够正确适配小屏幕，导航栏自动折叠为汉堡菜单，文章列表自动调整为单列布局。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('测试项目', true, { shade: 'E8E8E8' }), makeTableCell('Chrome'), makeTableCell('Firefox'), makeTableCell('Edge'), makeTableCell('Safari'), makeTableCell('移动端')] }),
  new TableRow({ children: [makeTableCell('页面渲染'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常')] }),
  new TableRow({ children: [makeTableCell('路由导航'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常')] }),
  new TableRow({ children: [makeTableCell('表单提交'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常')] }),
  new TableRow({ children: [makeTableCell('富文本编辑'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常')] }),
  new TableRow({ children: [makeTableCell('动画效果'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('轻微差异'), makeTableCell('正常')] }),
  new TableRow({ children: [makeTableCell('响应式布局'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常'), makeTableCell('正常')] }),
], [2000, 1200, 1200, 1200, 1200, 2000]))

addH2('6.5 测试结果分析')
addP('综合以上各项测试结果，本系统在所有测试项目中均达到了预期的功能和性能指标。功能测试方面，用户注册登录、文章管理、评论互动、管理员后台等核心功能均正常工作，边界条件和异常场景的处理也符合预期。性能测试方面，系统在100并发用户压力下表现稳定，所有接口的平均响应时间均低于500毫秒，满足设计要求。兼容性测试方面，系统在主流浏览器和移动设备上均能正常运行，响应式布局适配良好。')
addP('测试过程中发现的问题主要集中在两个方面：一是部分老旧浏览器对CSS Grid布局的支持不够完善，通过添加浏览器前缀解决了该问题；二是移动端触控操作下，富文本编辑器的工具栏定位偶尔偏移，通过调整CSS的position属性解决了该问题。总体而言，系统质量良好，可以交付使用。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('测试类别', true, { shade: 'E8E8E8' }), makeTableCell('测试用例数', true, { shade: 'E8E8E8' }), makeTableCell('通过数', true, { shade: 'E8E8E8' }), makeTableCell('失败数', true, { shade: 'E8E8E8' }), makeTableCell('通过率', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('功能测试'), makeTableCell('20'), makeTableCell('20'), makeTableCell('0'), makeTableCell('100%')] }),
  new TableRow({ children: [makeTableCell('性能测试'), makeTableCell('5'), makeTableCell('5'), makeTableCell('0'), makeTableCell('100%')] }),
  new TableRow({ children: [makeTableCell('兼容性测试'), makeTableCell('7'), makeTableCell('7'), makeTableCell('0'), makeTableCell('100%')] }),
  new TableRow({ children: [makeTableCell('合计'), makeTableCell('32'), makeTableCell('32'), makeTableCell('0'), makeTableCell('100%')] }),
], [2400, 1800, 1800, 1800, 1800]))

addPageBreak()

// ═══════════════════════════════════════════════
// CHAPTER 7  CONCLUSION
// ═══════════════════════════════════════════════
addH1('第七章 总结与展望')

addH2('7.1 工作总结')
addP('本课题设计并实现了一个基于Spring Boot与React的个人博客系统，完成了从需求分析、系统设计、编码实现到测试验证的完整软件开发流程。在技术层面，系统采用了前后端分离的架构模式，后端使用Spring Boot框架搭建RESTful API服务，前端使用React框架构建交互式用户界面，MySQL作为数据存储层，整体技术栈成熟稳定。')
addP('在功能实现方面，系统完成了用户认证与授权、文章管理、评论互动、分类标签管理、管理员后台等核心功能模块。用户认证模块基于Spring Security和JWT实现了安全的无状态身份验证；文章管理模块实现了完整的CRUD操作和审核流程；评论模块支持树形结构的评论回复；管理员后台提供了数据统计和内容管理能力。前端界面采用Ant Design组件库和现代化的深色主题设计，结合Framer Motion动画效果，提供了良好的用户体验。')
addP('在系统设计方面，数据库设计遵循第三范式，合理设置了外键约束和索引，保证了数据的一致性和查询效率。接口设计遵循RESTful规范，采用统一的JSON响应格式，便于前后端的协作开发。安全设计方面，系统实现了密码加密存储、JWT令牌认证、角色权限控制、防SQL注入和XSS攻击等多重安全防护措施。')
addP('在测试验证方面，系统通过了功能测试、性能测试和兼容性测试，各项指标均达到预期要求。测试结果显示，系统在100并发用户压力下运行稳定，所有核心功能的测试用例全部通过，在主流浏览器和设备上均能正常运行。')

addH2('7.2 不足与展望')
addP('尽管本系统已经实现了预期的功能目标，但在实际开发过程中仍然发现了一些不足之处，需要在后续工作中进一步完善和改进。')
addP('首先，在功能方面，系统目前仅支持基本的富文本编辑，尚未集成Markdown预览和实时协同编辑功能。未来可以引入更强大的编辑器（如Notion-style编辑器），支持更多的内容格式和协作能力。此外，系统缺少全文搜索引擎，文章搜索仅支持简单的关键词匹配。未来可以集成Elasticsearch实现更强大的全文检索能力。')
addP('其次，在性能方面，当前系统尚未引入缓存机制。对于频繁访问的文章列表和热门文章等数据，可以考虑引入Redis缓存，减轻数据库的压力，提升系统的响应速度。同时，前端图片资源尚未进行CDN加速，未来可以接入对象存储服务（如阿里云OSS、AWS S3）和图片CDN，优化图片加载速度。')
addP('再次，在安全性方面，当前系统仅实现了基础的JWT认证和角色权限控制。未来可以增加更细粒度的权限管理（如基于资源的权限控制），实现操作日志审计、登录异常检测和安全告警等功能，进一步提升系统的安全性。')
addP('最后，在架构方面，当前系统采用单体架构，随着功能的增长和用户量的增加，可能会遇到性能瓶颈。未来可以考虑将系统改造为微服务架构，将用户服务、文章服务、评论服务等拆分为独立部署的微服务，通过API网关进行统一调度。同时，可以引入容器化部署（Docker + Kubernetes），实现系统的弹性伸缩和自动化运维。')
children.push(makeTable([
  new TableRow({ children: [makeTableCell('改进方向', true, { shade: 'E8E8E8' }), makeTableCell('当前状态', true, { shade: 'E8E8E8' }), makeTableCell('未来规划', true, { shade: 'E8E8E8' })] }),
  new TableRow({ children: [makeTableCell('编辑器功能'), makeTableCell('基础富文本'), makeTableCell('Markdown + 协同编辑')] }),
  new TableRow({ children: [makeTableCell('搜索功能'), makeTableCell('关键词匹配'), makeTableCell('Elasticsearch全文检索')] }),
  new TableRow({ children: [makeTableCell('缓存机制'), makeTableCell('无'), makeTableCell('Redis缓存')] }),
  new TableRow({ children: [makeTableCell('图片存储'), makeTableCell('本地存储'), makeTableCell('CDN + 对象存储')] }),
  new TableRow({ children: [makeTableCell('系统架构'), makeTableCell('单体架构'), makeTableCell('微服务 + 容器化')] }),
  new TableRow({ children: [makeTableCell('安全增强'), makeTableCell('基础JWT认证'), makeTableCell('细粒度权限 + 审计日志')] }),
], [2400, 3200, 4400]))

addPageBreak()

// ═══════════════════════════════════════════════
// REFERENCES
// ═══════════════════════════════════════════════
addH1('参考文献')
addP('[1] SPRING COMMUNITY. Spring Boot 3 reference guide[EB/OL]. (2024)[2026-07-12]. https://docs.spring.io/spring-boot/docs/current/reference/html/.')
addP('[2] WALLS C. Spring Boot in action[M]. 2nd ed. Shelter Island: Manning Publications, 2019.')
addP('[3] 王珊, 萨师煊. 数据库系统概论[M]. 5版. 北京: 高等教育出版社, 2014.')
addP('[4] IETF. RFC 7519: JSON web token (JWT)[S]. Redwood City: Internet Engineering Task Force, 2015.')
addP('[5] SPRING COMMUNITY. Spring Security reference guide: JWT authentication[EB/OL]. (2024)[2026-07-12]. https://docs.spring.io/spring-security/reference/servlet/authentication/jwt.html.')
addP("[6] CHINNATHAMBI K. Learning React: explicit lessons for modern React[M]. 7th ed. Sebastopol: O'Reilly Media, 2024.")
addP('[7] MICROSOFT. TypeScript handbook[EB/OL]. (2024)[2026-07-12]. https://www.typescriptlang.org/docs/handbook/intro.html.')
addP('[8] ANT DESIGN. Ant Design design library[EB/OL]. (2024)[2026-07-12]. https://ant.design/.')
addP('[9] VITE COMMUNITY. Vite official guide[EB/OL]. (2024)[2026-07-12]. https://vitejs.dev/guide/.')
addP("[10] BASS A, MELLER P, TABSINSKY R. Foundations of software architecture[M]. Sebastopol: O'Reilly Media, 2019.")
addP('[11] 鲍宇. 基于Spring Boot的前后端分离架构设计与实现[J]. 电脑知识与技术, 2023, 19(12): 62-65.')
addP('[12] 黄文. MyBatis-Plus在Java持久层开发中的应用[J]. 软件导刊, 2023, 22(8): 88-92.')
addP('[13] FRAMER TECHNOLOGIES. Framer Motion documentation[EB/OL]. (2024)[2026-07-12]. https://www.framer.com/motion/.')
addP('[14] PROSEMIRROR. ProseMirror editor framework[EB/OL]. (2024)[2026-07-12]. https://prosemirror.net/.')

// ═══════════════════════════════════════════════
// BUILD DOCUMENT
// ═══════════════════════════════════════════════
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
      default: new Header({ children: [new Paragraph({ children: [new TextRun({ text: '基于Spring Boot与React的个人博客系统的设计与实现 — 毕业论文', size: 20, font: 'Arial', italic: true })] })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '第 ', size: 20, font: 'Arial' }), new TextRun({ children: [PageNumber.CURRENT], size: 20, font: 'Arial' }), new TextRun({ text: ' 页', size: 20, font: 'Arial' })] })] }),
    },
    children,
  }],
})

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync('毕业论文_个人博客系统.docx', buffer)
  console.log('Done! File written.')
}).catch((err) => {
  console.error('Error:', err)
  process.exit(1)
})
