<template>
  <div
    class="mapcontent"
    style="position: relative; width: 1000px; height: 800px"
  >
    <div ref="echartmap" class="echartmap"></div>

    <div
      v-show="tooltipBox"
      :style="positionStyle"
      class="flex position-absolute infobox"
    >
      <img class="icon10" src="@/assets/icon10.png" alt="" />
      <div class="tooltipBox p-2">
        <div class="flex align-center">
          <img
            class="tooltipImg rounded-min mr-1"
            src="https://img1.baidu.com/it/u=1494163501,3385442683&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=500"
            alt=""
          />
          <div class="flex flex-column">
            <span class="font-18 ft-color1 font-weigh-bold">{{
              curHhoverGroup.title
            }}</span>
            <span class="font-14 ft-color2">{{ curHhoverGroup.info }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as echarts from "echarts";
import bgimg from "@/assets/mapbg.jpg";
const echartmap = ref(null);
const getmap = () => {
  fetch("/data/map.json")
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log(res);
      initchart(res);
    });
};
getmap();

const dataList = [
  {
    name: "金华镇",
    value: [105.295085, 30.994827],
  },
  {
    name: "仁和镇",
    value: [105.579383, 30.963077],
  },
  {
    name: "洋溪镇",
    value: [105.453932, 30.785807],
  },
  {
    name: "大榆镇",
    value: [105.410087, 30.865399],
  },
];
const tooltipBox = ref(false);
const positionStyle = ref({
  left: 0,
  top: 0,
});
const initchart = (data) => {
  //注册地图，这个特别重要
  echarts.registerMap("射洪市", data);
  let myChart = echarts.init(echartmap.value);
  const options = {
    geo: [
      // 第一层
      {
        map: "射洪市",
        z: 3,
        zoom: 1.2,
        aspectScale: 1,
        roam: false, // 是否允许缩放
        top: "10%",
        layoutSize: "100%", //保持地图宽高比
        itemStyle: {
          borderColor: "#c8feff",
          borderWidth: 0,
          shadowBlur: 3,
          shadowColor: "#5c8c83",
          areaColor: {
            image: bgimg,
            repeat: "no-repeat",
          },
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            borderWidth: 1,
            areaColor: "#2da9ff",
          },
          label: {
            show: false,
            color: "#ffffff",
          },
        },
        select: {
          itemStyle: {
            shadowBlur: 10,
            borderWidth: 1,
            areaColor: "#2da9ff",
          },
          label: {
            color: "#ffffff",
          },
        },
      },
      {
        map: "射洪市",
        z: 2,
        zoom: 1.2,
        aspectScale: 1,
        roam: false,
        silent: true,
        top: "10.5%",
        layoutSize: "100%", //保持地图宽高比
        progressive: 1,
        itemStyle: {
          borderColor: "#74929c",
          borderWidth: 0,
          shadowBlur: 10,
          shadowColor: "#5c8c83",
          areaColor: "#53696f",
          shadowOffsetX: 0,
          shadowOffsetY: 8,
        },
      },
      {
        map: "射洪市",
        z: 1,
        zoom: 1.2,
        aspectScale: 1,
        top: "11%",
        silent: true,
        layoutSize: "100%", //保持地图宽高比
        progressive: 1,
        itemStyle: {
          borderColor: "#43565d",
          borderWidth: 1,
          shadowBlur: 5,
          shadowColor: "#507EF7",
          areaColor: "#43565d",
        },
      },
      {
        map: "射洪市",
        z: 0,
        zoom: 1.2,
        aspectScale: 1,
        top: "11.5%",
        silent: true,
        layoutSize: "100%", //保持地图宽高比
        progressive: 1,
        itemStyle: {
          borderColor: "#43565d",
          borderWidth: 1,
          shadowBlur: 2,
          shadowColor: "#5d8d7f",
          areaColor: "#43565d",
          shadowOffsetX: 0,
          shadowOffsetY: 3,
        },
      },
    ],
    series: [
      {
        zlevel: 5,
        zoom: 1.2,
        aspectScale: 1,
        shading: "realistic",
        name: "地图",
        map: "射洪市",
        selectedMode: "single", //选择类型,
        hoverable: true, //鼠标经过高亮
        type: "map",
        // 鼠标移入的样式
        emphasis: {
          disabled: true,
          label: {
            show: true,
            color: "#6B8EF7",
            fontSize: 16,
          },
          itemStyle: {
            borderColor: "#507EF7",
            borderWidth: 4,
            areaColor: "#DBF9FF",
          },
        },
        // 选中的样式
        select: {
          disabled: true,
          label: {
            color: "#6B8EF7",
            fontSize: 16,
          },
          itemStyle: {
            borderColor: "#507EF7",
            borderWidth: 4,
            areaColor: "#DBF9FF",
          },
        },
        // 地图样式
        itemStyle: {
          areaColor: "rgba(0,0,0,0)",
          borderWidth: 1,
          borderColor: "#e0ebef",
        },
        // 文字默认样式
        label: {
          show: true,
          color: "#DBF9FF",
          fontSize: 12,
          distance: 20,
          // backgroundColor: "rgba(0,0,0,0.9)",
          backgroundColor: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            {
              offset: 0,
              color: "rgba(0,0,0,0.9)", // 渐变起始颜色
            },
            {
              offset: 0.5,
              color: "rgba(0,0,0,0.9)", // 渐变起始颜色
            },
            {
              offset: 1,
              color: "#75AF96", // 渐变结束颜色
            },
          ]),
          padding: [2, 5, 2, 5],
          fontStyle: "italic",
          borderRadius: 3,
        },
        data: dataList,
      },
      // 标点
      {
        zlevel: 6,
        name: "地图",
        map: "射洪市",
        // 这个必须写上，否贼无法对应地理坐标
        coordinateSystem: "geo",
        // 散点图
        type: "scatter",
        // 标点的样式
        // itemStyle: { color: 'red' },
        symbolSize: [70, 75],
        data: [
          {
            name: "机关党组织",
            value: [105.295085, 30.994827],
            symbol: "image://http://localhost:5173/images/pot_icon2.png",
            info: "描述1",
          },
          {
            name: "社会党组织",
            value: [105.579383, 30.963077],
            symbol: "image://http://localhost:5173/images/pot_icon3.png",
            info: "描述2",
          },
          {
            name: "村社区党组织",
            value: [105.453932, 30.785807],
            symbol: "image://http://localhost:5173/images/pot_icon4.png",
            info: "描述3",
          },
          {
            name: "事业单位党组织",
            value: [105.410087, 30.865399],
            symbol: "image://http://localhost:5173/images/pot_icon5.png",
            info: "描述4",
          },
          {
            name: "企业党组织",
            value: [105.356623, 30.68649],
            symbol: "image://http://localhost:5173/images/pot_icon6.png",
            info: "描述5",
          },
        ],
      },
    ],
  };
  myChart.setOption(options);
  myChart.on("mousemove", handleMapOver); // 修改这里
  myChart.on("mouseout", handleMapOut); // 修改这里
};
const curHhoverGroup = ref({});
const handleMapOver = (params) => {
  const event = params.event;
  const mapBox = document.querySelector(".mapcontent").getBoundingClientRect();
  // console.info('handleMapOver', params)
  if (params.data) {
    tooltipBox.value = true;
    positionStyle.value.left = event.event.clientX - mapBox.left + "px";
    positionStyle.value.top = event.event.clientY - mapBox.top - 40 + "px";
    curHhoverGroup.value = {
      title: params.data.name,
      info: params.data.info,
    };
  }
  // console.log('over', params)
};
const handleMapOut = (params) => {
  tooltipBox.value = false;
};
</script>

<style scoped lang="scss">
.echartmap {
  width: 100%;
  height: 100%;
}
.icon10 {
  width: 50px;
  height: 22px;
  flex-shrink: 0;
  margin: auto 0;
}
.infobox {
  pointer-events: none;
}
.tooltipBox {
  width: 300px;
  background-image: url("@/assets/map_tooltip_bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.tooltipImg {
  width: 56px;
  height: 56px;
}
</style>
