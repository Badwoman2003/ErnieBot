<template>
    <!-- 此部分仅为样例展示，可以在此替换为任何内容 -->
    <t-card title="什么是综测填报？" bordered>
        <p>
            综测（综合素质测评）填报是对学生在德、智、体、美、劳等方面的综合表现进行量化评价的重要环节。它不仅关系到奖学金、评优评先等荣誉的评定，也是个人成长档案的重要组成部分。
        </p>
    </t-card>
    <t-divider>常见问题</t-divider>
    <t-collapse>
        <t-collapse-panel header="综测填报的流程是怎样的？" value="1">
            <ol>
                <li>登录学校综测系统。</li>
                <li>填写个人基本信息及各项加分材料。</li>
                <li>上传相关证明材料。</li>
                <li>提交后等待辅导员或班主任审核。</li>
                <li>如有异议可在公示期内申诉。</li>
            </ol>
        </t-collapse-panel>
        <t-collapse-panel header="哪些材料可以加分？" value="2">
            <ul>
                <li>各类获奖证书（如三好学生、优秀干部等）</li>
                <li>社会实践、志愿服务证明</li>
                <li>学术竞赛获奖、论文发表</li>
                <li>文体活动获奖</li>
            </ul>
        </t-collapse-panel>
        <t-collapse-panel header="填报时需要注意什么？" value="3">
            <ul>
                <li>确保信息真实有效，严禁弄虚作假。</li>
                <li>上传材料需清晰、完整。</li>
                <li>按时完成填报，避免错过截止时间。</li>
            </ul>
        </t-collapse-panel>
    </t-collapse>
    <t-divider>快速模拟填报</t-divider>
    <t-form label-width="100px" layout="vertical">
        <t-form-item label="姓名" name="name">
            <t-input placeholder="请输入姓名" />
        </t-form-item>
        <t-form-item label="学号" name="studentId">
            <t-input placeholder="请输入学号" />
        </t-form-item>
        <t-form-item label="班级" name="class">
            <t-input placeholder="请输入班级" />
        </t-form-item>
        <t-form-item label="加分项目" name="bonus">
            <t-select placeholder="请选择加分项目" multiple>
                <t-option value="volunteer">志愿服务</t-option>
                <t-option value="competition">学科竞赛</t-option>
                <t-option value="sports">体育活动</t-option>
                <t-option value="art">文艺活动</t-option>
                <t-option value="other">其他</t-option>
            </t-select>
        </t-form-item>
        <t-form-item label="获奖/证明材料" name="proof">
            <t-upload theme="file" placeholder="上传相关证明材料" />
        </t-form-item>
        <t-form-item>
            <t-button theme="primary" type="submit">提交模拟填报</t-button>
        </t-form-item>
    </t-form>
    <t-alert theme="info" title="温馨提示" :close="false" style="margin-top: 16px;">
        请如实填写综测信息，材料不实将影响最终评定结果。如有疑问可随时咨询辅导员或使用右下角智能体提问。
    </t-alert>
</template>